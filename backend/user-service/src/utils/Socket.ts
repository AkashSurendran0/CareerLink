import {Server} from "socket.io";
import http from "http";
import axios from "axios";

export const initUserSocket = (server: http.Server) => {
    const io=new Server(server, {
        cors: {origin:"*", credentials:true}
    });

    const onlineUsers=new Map();
    const busyUsers=new Set();
    const activeCalls=new Map();

    io.on("connection", (socket)=>{
        console.log("User socket connected:", socket.id);

        socket.on("ring-call", ({from, caller, to, reciever, callType}) => {
            
            if((!onlineUsers.has(to))){
                io.to(socket.id).emit("call-failed", {
                    reason:"USER_OFFLINE"
                });
                return;
            }

            if(busyUsers.has(to)){
                io.to(socket.id).emit("call-failed", {
                    reason:"USER_BUSY"
                });
                return;
            }

            if(busyUsers.has(from)){
                io.to(socket.id).emit("call-failed", {
                    reason:"IN_ANOTHER_CALL"
                });
            }

            busyUsers.add(from);
            busyUsers.add(to);
            activeCalls.set(from, to);
            activeCalls.set(to, from);

            const receiverSocket=onlineUsers.get(to)!;

            io.to(receiverSocket).emit("incoming-call", {
                from,
                caller,
                callType
            });

            io.to(socket.id).emit("ringing", {
                reciever,
                callType
            });
        });

        socket.on("reject-call", ({userId, callerId}) => {
            const callerSocket=onlineUsers.get(callerId);
            if(!callerSocket) return;

            if(busyUsers.has(userId)) busyUsers.delete(userId);
            if(busyUsers.has(callerId)) busyUsers.delete(callerId);
            activeCalls.delete(userId);
            activeCalls.delete(callerId);  

            io.to(callerSocket).emit("call-declined");
        });

        socket.on("user-online", (userId: string) => {
            onlineUsers.set(userId, socket.id);
            console.log("User online:", userId);

            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("get-online-users", () => {
            socket.emit("online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("join-conversation", async ({convoId, userId})=>{
            socket.join(convoId);

            await axios.patch(`http://localhost:5000/chat/v1/readMessages?convo=${convoId}&user=${userId}`);

            socket.to(convoId).emit("messages-read", {
                convoId,
                readBy:userId
            });
        });

        socket.on("leave-conversation", (convoId) => {
            socket.leave(convoId);
        });

        socket.on("send-message", async ({convoId, message, userId}) => {
            socket.to(convoId).emit("receive-message", message, convoId);

            const room=io.sockets.adapter.rooms.get(convoId);
            const roomsSize=room? room.size : 0;

            if(roomsSize > 1) {
                await axios.patch(`http://localhost:5000/chat/v1/readMessages?convo=${convoId}&user=${userId}`);
                io.in(convoId).emit("messages-read", { convoId, readBy: userId });
            }
        });

        socket.on("disconnect", () => {
            const entries=[...onlineUsers.entries()];
            const userEntry=entries.find(([_, sid]) => sid === socket.id);

            if(userEntry) {
                const [userId] = userEntry;
                onlineUsers.delete(userId);

                if(!busyUsers.has(userId)) return;

                busyUsers.delete(userId);
                const otherUser=activeCalls.get(userId);
                busyUsers.delete(otherUser);
                const otherSocket=onlineUsers.get(otherUser);

                io.to(otherSocket).emit("user-disconnected");
                io.emit("online-users", Array.from(onlineUsers.keys()));
            }
        });
    });

    return io;

};
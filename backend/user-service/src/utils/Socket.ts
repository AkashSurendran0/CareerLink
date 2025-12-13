import {Server} from "socket.io";
import http from "http";
import axios from "axios";

export const initUserSocket = (server: http.Server) => {
    const io=new Server(server, {
        cors: {origin:"*", credentials:true}
    });

    const onlineUsers=new Map();

    io.on("connection", (socket)=>{
        console.log("User socket connected:", socket.id);

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

                io.emit("online-users", Array.from(onlineUsers.keys()));
            }
        });
    });

    return io;

};
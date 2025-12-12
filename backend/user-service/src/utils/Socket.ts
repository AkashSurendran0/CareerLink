import {Server} from "socket.io";
import http from "http";

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
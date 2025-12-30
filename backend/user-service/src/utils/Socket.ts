import { Server } from "socket.io";
import http from "http";
import axios from "axios";

export const initUserSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: { origin: "*", credentials: true }
    });

    interface CallRoom {
        users: Set<string>;
        offerSent: boolean;
    }

    const onlineUsers = new Map<string, string>();
    const busyUsers = new Set<string>();
    const activeCalls = new Map<string, string>();
    const callRooms = new Map<string, CallRoom>();

    io.on("connection", (socket) => {
        console.log("User socket connected:", socket.id);

        socket.on("ring-call", ({ from, caller, callerImage, to, reciever, callType }) => {
            console.log(from, caller, callerImage, to, reciever, callType)
            if ((!onlineUsers.has(to))) {
                io.to(socket.id).emit("call-failed", {
                    reason: "USER_OFFLINE"
                });
                return;
            }

            if (busyUsers.has(to)) {
                io.to(socket.id).emit("call-failed", {
                    reason: "USER_BUSY"
                });
                return;
            }

            if (busyUsers.has(from)) {
                io.to(socket.id).emit("call-failed", {
                    reason: "IN_ANOTHER_CALL"
                });
            }

            busyUsers.add(from);
            busyUsers.add(to);
            activeCalls.set(from, to);
            activeCalls.set(to, from);

            const receiverSocket = onlineUsers.get(to)!;

            io.to(receiverSocket).emit("incoming-call", {
                from,
                caller,
                callerImage,
                callType
            });

            io.to(socket.id).emit("ringing", {
                reciever,
                callType
            });
        });

        socket.on("reject-call", ({ userId, callerId }) => {
            const callerSocket = onlineUsers.get(callerId);
            if (!callerSocket) return;

            if (busyUsers.has(userId)) busyUsers.delete(userId);
            if (busyUsers.has(callerId)) busyUsers.delete(callerId);
            activeCalls.delete(userId);
            activeCalls.delete(callerId);

            io.to(callerSocket).emit("call-declined");
        });

        socket.on("accept-call", ({ callId, callerId, calleeName, calleeImage, callerName, callerImage }) => {
            const callerSocket = onlineUsers.get(callerId);
            if (!callerSocket) {
                io.to(socket.id).emit("call-failed", {
                    reason: "USER_OFFLINE"
                });
                return;
            }

            io.to(callerSocket).emit("call-accepted", {
                callId,
                name: calleeName,
                image: calleeImage
            });

            io.to(socket.id).emit("call-accepted", {
                callId,
                name: callerName,
                image: callerImage
            });
        });

        socket.on("join-call", (callId) => {
            if (!callId) return;

            socket.join(callId);

            if (!callRooms.has(callId)) {
                callRooms.set(callId, {
                    users: new Set([socket.id]),
                    offerSent: false
                });
                console.log(`User ${socket.id} created room ${callId}`);
            } else {
                const room = callRooms.get(callId)!;
                room.users.add(socket.id);
                console.log(`User ${socket.id} joined room ${callId}`);
            }

            if (!callRooms.has(callId)) return;
            const room = callRooms.get(callId)!;
            const roomSize = io.sockets.adapter.rooms.get(callId)?.size || 0;

            if (roomSize === 2 && !room.offerSent) {
                const users = Array.from(room.users);
                const offerer = users[0];
                if (offerer) {
                    // Send create-offer to ALL users in the room
                    io.to(offerer).emit("create-offer");
                    room.offerSent = true;
                    console.log(`Sent create-offer to room ${callId}`);
                }
            }
        });

        socket.on("webrtc-offer", ({ callId, offer }) => {
            socket.to(callId).emit("webrtc-offer", { offer });
        });

        socket.on("webrtc-answer", ({ callId, answer }) => {
            socket.to(callId).emit("webrtc-answer", { answer });
        });

        socket.on("ice-candidate", ({ callId, candidate }) => {
            socket.to(callId).emit("ice-candidate", { candidate });
        });

        socket.on("end-call", ({ callId }) => {
            socket.leave(callId);
            const entries = [...onlineUsers.entries()];
            const userEntry = entries.find(([_, sid]) => sid === socket.id);

            if (userEntry) {
                const [userId] = userEntry;
                const otherUser = activeCalls.get(userId);

                if (otherUser) {
                    busyUsers.delete(userId);
                    busyUsers.delete(otherUser);
                    activeCalls.delete(userId);
                    activeCalls.delete(otherUser);

                    const otherSocket = onlineUsers.get(otherUser);
                    if (otherSocket) {
                        io.to(otherSocket).emit("end-call", {
                            reason: "USER_LEFT"
                        });
                    }
                }
            }
        });

        socket.on("leave-call", ({ callId }) => {
            socket.leave(callId);
        });

        socket.on("user-online", (userId: string) => {
            onlineUsers.set(userId, socket.id);
            console.log("User online:", userId);

            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("get-online-users", () => {
            socket.emit("online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("join-conversation", async ({ convoId, userId }) => {
            socket.join(convoId);

            await axios.patch(`http://localhost:5000/chat/v1/readMessages?convo=${convoId}&user=${userId}`);

            socket.to(convoId).emit("messages-read", {
                convoId,
                readBy: userId
            });
        });

        socket.on("leave-conversation", (convoId) => {
            socket.leave(convoId);
        });

        socket.on("send-message", async ({ convoId, message, userId }) => {
            socket.to(convoId).emit("receive-message", message, convoId);

            const room = io.sockets.adapter.rooms.get(convoId);
            const roomsSize = room ? room.size : 0;

            if (roomsSize > 1) {
                await axios.patch(`http://localhost:5000/chat/v1/readMessages?convo=${convoId}&user=${userId}`);
                io.in(convoId).emit("messages-read", { convoId, readBy: userId });
            }
        });

        socket.on("disconnect", () => {
            const entries = [...onlineUsers.entries()];
            const userEntry = entries.find(([_, sid]) => sid === socket.id);

            for (const [callId, room] of callRooms) {
                if (room.users.has(socket.id)) {
                    room.users.delete(socket.id);

                    if (room.users.size === 0) {
                        callRooms.delete(callId);
                    } else {
                        // Notify remaining users
                        room.offerSent = false;
                        socket.to(callId).emit("end-call", { reason: "USER_DISCONNECTED" });
                    }
                }
            }

            if (userEntry) {
                const [userId] = userEntry;
                onlineUsers.delete(userId);

                if (!busyUsers.has(userId)) return;

                busyUsers.delete(userId);
                const otherUser = activeCalls.get(userId);

                if (otherUser) {
                    busyUsers.delete(otherUser);
                    const otherSocket = onlineUsers.get(otherUser);
                    activeCalls.delete(userId);
                    activeCalls.delete(otherUser);

                    if (otherSocket) {
                        io.to(otherSocket).emit("user-disconnected");
                    }
                }
                io.emit("online-users", Array.from(onlineUsers.keys()));
            }
        });
    });

    return io;

};
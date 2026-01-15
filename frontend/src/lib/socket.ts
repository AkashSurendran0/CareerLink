import {io} from 'socket.io-client'

export const notificationSocket = io("http://localhost:5004", {
  path: "/notification/socket.io",
  transports: ["websocket"],
  withCredentials: true
});;

export const userSocket = io("http://localhost:5001", {
  path: "/user/socket.io",
  transports: ["websocket"],
  withCredentials: true
});;
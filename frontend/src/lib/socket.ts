import {io} from 'socket.io-client'

export const notificationSocket = io("https://careerlink.space", {
  path: "/notification/socket.io",
  transports: ["websocket"],
  withCredentials: true
});;

export const userSocket = io("https://careerlink.space", {
  path: "/user/socket.io",
  transports: ["websocket"],
  withCredentials: true
});;
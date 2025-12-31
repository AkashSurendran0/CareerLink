import {io} from 'socket.io-client'

const notificationRoute=process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_ROUTE
const userRoute=process.env.NEXT_PUBLIC_USER_SERVICE_ROUTE

export const notificationSocket=io(notificationRoute, {
    transports:['websocket'],
    withCredentials:true
})

export const userSocket=io(userRoute, {
    transports:['websocket'],
    withCredentials:true
})
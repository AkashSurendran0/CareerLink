import {io} from 'socket.io-client'

export const notificationSocket=io('http://localhost:5004', {
    transports:['websocket'],
    withCredentials:true
})

export const userSocket=io('http://localhost:5001', {
    transports:['websocket'],
    withCredentials:true
})
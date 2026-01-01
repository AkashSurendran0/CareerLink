import {io} from 'socket.io-client'

const apiGatewayRoute=process.env.NEXT_PUBLIC_API_GATEWAY_ROUTE

export const notificationSocket=io(`${apiGatewayRoute}/notification`, {
    transports:['websocket'],
    withCredentials:true
})

export const userSocket=io(`${apiGatewayRoute}/user`, {
    transports:['websocket'],
    withCredentials:true
})
import {Server} from 'socket.io'
import http from 'http'
import { logger } from './logger'

let io:Server

export function initSocket(server:http.Server) {
    io=new Server(server, {
        cors: {origin:'*'}
    })

    io.on('connection', (socket)=>{
        logger.info(`User connected: ${socket.id}`)
        socket.on('join', (userId)=>{
            socket.join(userId)
            logger.info(`User ${userId} joined the room`)
        })
    })
}  

export function getIO() {
    if(!io) throw new Error('Socker.io not initialized')
    return io
}
import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
	cors: { origin: 'http://localhost:5173' },
})
// used to store online users
const userSocketMap = {}

export function getReceiverSocketId(userId) {
	return userSocketMap[userId]
}

io.on('connection', (socket) => {
	console.log('A user connected', socket.id)

	const userId = socket.handshake.query.userId
	if (userId) userSocketMap[userId] = socket.id

	//io.emit() is used to send events to all connected clients
	// send online users to each client (excluding themselves)
	Object.entries(userSocketMap).forEach(([id, socketId]) => {
		io.to(socketId).emit(
			'getOnlineUsers',
			Object.keys(userSocketMap).filter((id) => id !== userId)
		)
	})

	socket.on('disconnect', () => {
		console.log('A user disconnected ', socket.id)
		delete userSocketMap[userId]

		// re-send personalized lists again after someone disconnects
		Object.entries(userSocketMap).forEach(([id, socketId]) => {
			io.to(socketId).emit(
				'getOnlineUsers',
				Object.keys(userSocketMap).filter((id) => id !== userId)
			)
		})
	})

	socket.on('newMassages', (message) => {
		const receiverSocketId = getReceiverSocketId(message.receiverId)

		if (receiverSocketId) {
			// send to receiver only
			io.to(receiverSocketId).emit('newMessage', message)
		}

		// also emit to sender so their UI updates
		const senderSocketId = getReceiverSocketId(message.senderId)
		if (senderSocketId) {
			io.to(senderSocketId).emit('newMessage', message)
		}
	})
})

export { io, app, server }

import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from '../lib/socket.js'

export const getUserForSidebar = async (req, res) => {
	try {
		const loggedUserId = req.user._id
		const filteredUsers = await User.find({
			id: { $ne: loggedUserId },
		}).select('-password')

		res.status(200).json(filteredUsers)
	} catch (error) {
		console.log('eror in getuserforsidebar:', error.message)
		res.status(500).json({ error: 'Internal server Error' })
	}
}

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params
		const myId = req.user._id

		const messages = await Message.find({
			$or: [
				{ senderId: myId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: myId },
			],
		})
			.sort({ createdAt: 1 })
			.lean()
		res.status(200).json(messages)
	} catch (error) {
		console.log('eror in getuserforsidebar:', error.message)
		res.status(500).json({ error: 'Internal server Error' })
	}
}

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body
		const { userId: receiverId } = req.params
		const senderId = req.user._id

		let imageUrl
		if (imageUrl) {
			//upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url
		}
		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		})
		await newMessage.save()
		// console.log(newMessage)
		// todo:...
		const receiverSocketid = getReceiverSocketId(receiverId)

		if (receiverSocketid) {
			io.to(receiverSocketid).emit('newmessage', newMessage)
		}

		res.status(201).json(newMessage)
	} catch (error) {
		console.log('Error in sendMessage controller:', error.message)
		res.status(500).json({ error: 'internal server error' })
	}
}

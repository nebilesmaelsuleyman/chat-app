import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
	sendMessage,
	getUserForSidebar,
	getMessages,
} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/user', protectRoute, getUserForSidebar)
router.get('/messages/:userId', protectRoute, getMessages)
router.post('/messages/send/:userId', protectRoute, sendMessage)

export default router

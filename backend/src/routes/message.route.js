import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
	sendMessage,
	getUserForSidebar,
	getMessages,
} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/user', protectRoute, getUserForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)

export default router

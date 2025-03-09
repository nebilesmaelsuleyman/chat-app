import express from 'express'
import {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
	hellow,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
const router = express.Router()
router.get('/', hellow)
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-picture', protectRoute, updateProfile)
router.get('/check', protectRoute, checkAuth)

export default router

import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookie.jwt
		if (!token) {
			return res.status(400).json({ message: 'user not loged in ' })
		}
		const decoded = jwt.verify(token, process.env.jwt_secret)
		if (!decoded) {
			return res.status(401).json({ message: 'unauthorized -invalid Token' })
		}
		const user = await User.findById(decoded.userId).select('-password')

		req.user = user
		next()
	} catch (error) {
		console.log('error in protectRoute middleware', error.message)
		res.status(500).json({ message: 'internal server error ' })
	}
}

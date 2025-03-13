import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export async function signup(req, res) {
	try {
		const { fullname, email, password } = req.body

		if (!fullname || !email || !password) {
			console.log('one or more parameters are absent')
			return res.status(400).json({ message: 'Missing required fields' })
		}

		const user = await User.findOne({ email })
		if (user) {
			return res
				.status(400)
				.json({ message: 'User with this email already exists' })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = await User.create({
			fullname,
			email,
			password: hashedPassword,
		})

		if (newUser) {
			generateToken(newUser._id, res)
			res.status(201).json({
				status: 'success',
				data: newUser,
			})
		} else {
			res.status(400).json({
				message: 'invalid user data',
			})
		}
	} catch (error) {
		console.error('Error in signup controller:', error)
		if (error.name === 'ValidationError') {
			return res.status(400).json({ message: error.message })
		}
		res.status(500).json({ message: 'Internal server error' })
	}
}
export const login = async (req, res) => {
	const { email, password } = req.body
	try {
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}
		console.log(user)

		const isPassword = await bcrypt.compare(password, user.password)
		console.log(isPassword)
		if (!isPassword) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const token = generateToken(user._id, res)
		console.log(token)
		return res.status(200).json({ message: 'success', user })
	} catch (error) {
		console.error('Login error:', error)
		return res.status(500).json({ message: 'Internal server error' })
	}
}
export const logout = async (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 })
		res.status(200).json({ message: 'logged out succesfully' })
	} catch (error) {
		console.log('error in logout controller ', error.message)
		res.status(500).json({ message: 'internal server error' })
	}
}

export const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body
		const userId = req.user._id
		if (!profilePic) {
			return res.status(400).json({ message: 'profile is required' })
		}
		const updloadResponse = await cloudinary.uploader.upload(profilePic)
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: updloadResponse.secure_url },
			{ new: true }
		)
		res.status(200).json(updateUser)
	} catch (error) {
		console.log('error in update profile', error)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const checkAuth = async (req, res) => {
	//this logic is for checking user when the page is reloaded it just send the user
	try {
		res.status(200).json(req.user)
	} catch (error) {
		console.log('Eror in checkAuth controller', error.message)
		res.status(500).json({ message: 'internal server Error' })
	}
}

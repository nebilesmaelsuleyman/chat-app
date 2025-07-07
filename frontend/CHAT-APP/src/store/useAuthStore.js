import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'
import { io } from 'socket.io-client'

const Base_url = 'http://localhost:5001'

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isSigningUp: false,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')
			set({ authUser: res.data })
			get().connectSocket()
		} catch (error) {
			console.log('erro in chackAuth', error)
			set({ authUser: null })
		} finally {
			set({ isCheckingAuth: false })
		}
	},
	signup: async (data) => {
		set({ isSigningUp: true })
		try {
			const res = await axiosInstance.post('/auth/signup', data)
			set({ authUser: res.data })
			toast.success('Account created successfully')
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isSigningUp: false })
		}
	},
	login: async (data) => {
		set({ isLoggingIn: true })
		try {
			const res = await axiosInstance.post('/auth/login', data)
			set({ authUser: res.data })
			toast.success('logged in successfully')
			get().connectSocket()
		} catch (error) {
			toast.error(error.response.data.message)
			console.error('error in login react', error)
		} finally {
			set({ isLoggingIn: false })
		}
	},

	logout: async () => {
		try {
			set({ authUser: null })
			toast.success('Logged out successfully')
			await axiosInstance.post('/auth/logout')
			get().disconnectSocket()
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })
		try {
			const res = await axiosInstance.put('/auth/update-picture', data)
			set({ authUser: res.data })
			toast.success('Profile updated successfully')
		} catch (error) {
			console.log('error in update profile:', error)
			toast.error(error.response.data.message)
		} finally {
			set({ isUpdatingProfile: false })
		}
	},

	connectSocket: async () => {
		const { authUser } = get()
		if (!authUser) return
		const socket = io(Base_url, {
			query: {
				userId: authUser._id,
			},
		})
		socket.connect()
		set({ socket: socket })
		socket.on('getOnlineUsers', (userIds) => {
			set({ onlineUsers: userIds })
		})
	},
	disconnectSocket: async () => {
		if (get().socket?.connected) get().socket.disconnect()
	},
}))

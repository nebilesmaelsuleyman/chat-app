import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'
export const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isSigningUp: false,

	isCheckingAuth: true,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')
			set({ authusUser: res.data })
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
		try {
			const res = await axiosInstance.post('/auth/login', data)
			set({ authUser: res.data })
			toast.success('logged in successfully')
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isLoggingIng: false })
		}
	},

	logout: async (params) => {
		try {
			set({ authUser: null })
			toast.success('Logged out successfully')
			await axiosInstance.post('/auth/logout')
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })
		try {
			const res = await axiosInstance.put('/auth/update-profile', data)
			set({ authUser: res.data })
			toast.success('Profile updated successfully')
		} catch (error) {
			console.log('error in update profile:', error)
			toast.error(error.response.data.message)
		} finally {
			set({ isUpdatingProfile: false })
		}
	},
}))

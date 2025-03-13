import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set) => ({
	messages: [],
	users: [],
	selectedUser: null,
	insUserLoading: false,
	isMessageLoding: false,

	getUser: async () => {
		set({ usUserLoading: true })
		try {
			const res = await axiosInstance.get('/message/users')
			set({ users: res.data })
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ usUserLoading: false })
		}
	},

	getMessage: async (userId) => {
		set({ isMessageLoding: true })
		try {
			const res = await axiosInstance.get(`/messages/${userId}`)
			set({ messages: res.data })
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isMessageLoding: false })
		}
	},
}))

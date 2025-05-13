import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set, get) => ({
	messages: [],
	Users: [],
	selectedUser: null,
	isUserLoading: false,
	isMessageLoading: false,

	getUsers: async () => {
		set({ isUserLoading: true })
		try {
			const res = await axiosInstance.get('/message/users')
			set({ Users: res.data })
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isUserLoading: false })
		}
	},

	getMessage: async (userId) => {
		set({ isMessageLoading: true })
		try {
			const res = await axiosInstance.get(`/messages/${userId}`)
			set({ messages: res.data })
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isMessageLoading: false })
		}
	},
	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get()
		try {
			const res = await axiosInstance.post(
				`/messages/send${selectedUser._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},
	setSelectedUser: (selectedUser) => set({ selectedUser }),
}))

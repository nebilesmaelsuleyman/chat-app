import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'
export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessageLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true })
		try {
			const res = await axiosInstance.get('/user')
			set({ users: res.data })
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isUsersLoading: false })
		}
	},

	getMessages: async (userId) => {
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
		if (!selectedUser) {
			toast.error('No user selected!')
			return
		}

		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},

	setSelectedUser: (user) =>
		set((state) => {
			if (state.selectedUser?._id === user._id) return {}
			return { selectedUser: user }
		}),

	subscribeToMessages: () => {
		const { selectedUser } = get()
		if (!selectedUser) return
		const socket = useAuthStore.getState().socket

		// todo: optimize this one later
		socket.on('newmessage', (newMessage) => {
			set({ messages: [...get().messages, newMessage] })
		})
	},
	unsubscribeTomessage: () => {
		const socket = useAuthStore.getState().socket
		socket.off('newMessage')
	},
}))

import { create } from 'zustand'
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
}))

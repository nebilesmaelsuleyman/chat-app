import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import SignUp from './pages/Signup'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import Navbar from './components/Navbar'

const App = () => {
	const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
	console.log('online users', onlineUsers)
	const { theme } = useThemeStore()
	useEffect(() => {
		checkAuth()
	}, [checkAuth])
	console.log('auth user', authUser)

	if (isCheckingAuth && !authUser) return
	;<div className='flex items-center justify-center h-screen'>
		<Loader className='size-10 animate-spin' />
	</div>
	return (
		<div data-theme={theme} className='text-red-200'>
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={authUser ? <Home /> : <Navigate to={'/login'} />}
				/>
				<Route
					path='/signup'
					element={!authUser ? <SignUp /> : <Navigate to={'/'} />}
				/>
				<Route
					path='/login'
					element={!authUser ? <Login /> : <Navigate to={'/'} />}
				/>
				<Route path='/settings' element={<Setting />} />
				<Route
					path='/profile'
					element={authUser ? <Profile /> : <Navigate to={'/login'} />}
				/>
			</Routes>
		</div>
	)
}
export default App

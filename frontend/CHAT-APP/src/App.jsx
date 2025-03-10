import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import SignUp from './pages/Signup'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'

const App = () => {
	const { authUser, checkAuth } = useAuthStore()
	useEffect(() => {
		checkAuth()
	}, [checkAuth])
	console.log(authUser)

	return (
		<div className='text-red-200'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/login' element={<Login />} />
				<Route path='/setting' element={<Setting />} />
				<Route path='/profile' element={<Profile />} />
			</Routes>
		</div>
	)
}
export default App

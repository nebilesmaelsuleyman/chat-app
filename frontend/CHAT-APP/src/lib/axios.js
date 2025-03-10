import axios from 'axios'

export const axiosInstance = axios.create({
	baseURL: 'http:/lcalhost:5001/api',
	withCredentials: true,
})

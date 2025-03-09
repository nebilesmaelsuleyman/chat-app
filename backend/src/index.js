import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())
dotenv.config()

app.use('/api/auth', authRouter)

const Port = process.env.PORT
app.listen(Port, () => {
	console.log('server is running on port 5001')
	connectDB()
})

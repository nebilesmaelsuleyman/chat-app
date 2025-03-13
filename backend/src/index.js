import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(express.json({ limit: '500mb' }))
app.use(cookieParser())

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
dotenv.config()

app.use('/api/auth', authRouter)

const Port = process.env.PORT
app.listen(Port, () => {
	console.log('server is running on port 5001')
	connectDB()
})

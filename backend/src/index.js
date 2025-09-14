import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import messgaeRouter from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
// import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { app, server } from './lib/socket.js'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cookieParser())
app.use(express.json()) // ← ADD THIS (to parse JSON bodies)

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use('/api/auth', authRouter)
app.use('/api', messgaeRouter)

// ✅ FIX: Serve frontend in both development and production
app.use(express.static(path.join(__dirname, '../../frontend/CHAT-APP/dist')))

// ✅ FIX: Serve index.html for all routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/CHAT-APP/dist/index.html'))
})

const Port = process.env.PORT
server.listen(Port, () => {
	console.log('server is running on port 5001')
	connectDB()
})

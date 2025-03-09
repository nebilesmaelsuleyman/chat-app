import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URL)
		console.log(`mongoddb connected:${conn.connection.host}`)
	} catch (error) {
		console.log('mongodb connectin error', error)
	}
}

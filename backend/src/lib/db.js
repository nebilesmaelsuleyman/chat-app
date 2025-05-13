import mongoose from 'mongoose'

export const connectDB = async () => {
	const uri = process.env.MONGODB_URL
	if (!uri) {
		throw new Error('MONGODB_URL is missing in enviroment variables')
	}
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	console.log('Mongodb connected')
}

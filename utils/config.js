/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_TEST_URI= process.env.MONGODB_TEST_URI
const LIVEKIT_API_KEY=process.env.LIVEKIT_API_KEY
const LIVEKIT_API_SECRET= process.env.LIVEKIT_API_SECRET
const PUBLIC_LIVEKIT_URL= process.env.PUBLIC_LIVEKIT_URL
const FRONTEND = process.env.FRONTEND
module.exports = {
	MONGODB_URI,
	MONGODB_TEST_URI,
	PORT,
	LIVEKIT_API_KEY,
	LIVEKIT_API_SECRET,
	PUBLIC_LIVEKIT_URL,
	FRONTEND
}
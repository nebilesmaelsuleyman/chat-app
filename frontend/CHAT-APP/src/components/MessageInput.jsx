import { useState } from 'react'
const MessageInput = () => {
	const [text, stText] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	const fileInputRef = useRef(null)
	return <div>message input</div>
}
export default MessageInput

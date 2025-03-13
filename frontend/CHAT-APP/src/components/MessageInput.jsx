import { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
const MessageInput = () => {
	const [text, stText] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	const fileInputRef = useRef(null)
	const { sendMessage } = useChatStore()

	const handleImageChange = (e) => {}
	const removeImage = () => {}
	const handleSendMessage = async (e) => {}
	return <div>message input</div>
}
export default MessageInput

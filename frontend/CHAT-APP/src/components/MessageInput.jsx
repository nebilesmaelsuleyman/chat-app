import { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import toast from 'react-hot-toast'
const MessageInput = () => {
	const [text, setText] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	const fileInputRef = useRef(null)
	const { sendMessage } = useChatStore()

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}
		const reader = new FileReader()
		reader.onloadend = () => {
			setImagePreview(reader.result)
		}
		reader.readAsDataURL(file)
	}
	const removeImage = () => {
		setImagePreview(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}
	const handleSendMessage = async (e) => {
		e.preventDefault()
		if (!text.trim() && !imagePreview) return

		try {
			await sendMessage({
				text: text.trim(),
				image: imagePreview,
			})

			// Clear form
			setText('')
			setImagePreview(null)
			if (fileInputRef.current) fileInputRef.current.value = ''
		} catch (error) {
			console.error('Failed to send message:', error)
		}
	}
	return <div>message input</div>
}
export default MessageInput

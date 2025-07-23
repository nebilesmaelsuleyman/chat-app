import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useRef, useState } from 'react'

// Utility function to format message time
const formatMessageTime = (timestamp) => {
	const date = new Date(timestamp)
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
const ChatContainer = () => {
	const {
		messages: liveMessages,
		getMessage,
		isMessageLoading,
		selectedUser,
		subscribeToMessages,
		unsubscribeTomessage,
	} = useChatStore()
	const [localMessages, setLocalMessages] = useState([])

	const messageEndRef = useRef(null)

	const { authUser } = useAuthStore()

	useEffect(() => {
		if (!selectedUser._id || !authUser._id) return
		console.log('selected user from chatcontainer', selectedUser._id)
		const savedMessages = localStorage.getItem(`chat-${selectedUser._id}`)
		if (savedMessages) {
			setLocalMessages(JSON.parse(savedMessages))
		}
		getMessage(selectedUser._id)

		subscribeToMessages()
		return () => unsubscribeTomessage()
	}, [
		selectedUser._id,
		authUser._id,
		getMessage,
		subscribeToMessages,
		unsubscribeTomessage,
	])

	const allMessages = [...localMessages, ...liveMessages].filter(
		(message, index, self) =>
			index === self.findIndex((m) => m._id === message._id)
	)

	useEffect(() => {
		if (messageEndRef.current && allMessages.length) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [allMessages])

	useEffect(() => {
		if (selectedUser?._id && liveMessages.length) {
			localStorage.setItem(
				`chat-${selectedUser._id}`,
				JSON.stringify(liveMessages)
			)
		}
	}, [liveMessages, selectedUser?._id])

	if (isMessageLoading)
		return (
			<div className=' flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)
	return (
		<div className='flex-1 flex flex-col overflow-auto'>
			<ChatHeader />

			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{allMessages.map((message) => (
					<div
						key={message._id}
						className={`chat ${
							message.senderId === authUser._id ? 'chat-end' : 'chat-start'
						}`}
						ref={messageEndRef}
					>
						<div className=' chat-image avatar'>
							<div className='size-10 rounded-full border'>
								<img
									src={
										message.senderId === authUser._id
											? authUser.profilePic || '/avatar.png'
											: selectedUser.profilePic || '/avatar.png'
									}
									alt='profile pic'
								/>
							</div>
						</div>
						<div className='chat-header mb-1'>
							<time className='text-xs opacity-50 ml-1'>
								{formatMessageTime(message.createdAt)}
							</time>
						</div>
						<div className='chat-bubble flex flex-col'>
							{message.image && (
								<img
									src={message.image}
									alt='Attachment'
									className='sm:max-w-[200px] rounded-md mb-2'
								/>
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>
			<MessageInput />
		</div>
	)
}
export default ChatContainer

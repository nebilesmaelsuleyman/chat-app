import { Divide } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
const ChatContainer = () => {
	const { messages, getMessages, isMessageLoading, selectedUser } =
		useChatStore()
	const { authUser } = useAuthStore()

	useEffect(() => {
		getMessages(selectedUser._id)
	}, [selectedUser > _id, getMessages])
	if (isMessageLoading)
		return (
			<div className=' flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)
	return (
		<div className=' flex-1 flex flex-col overflow-auto'>
			<ChatHeader />
			<p>messages</p>
			<MessageInput />
		</div>
	)
}

export default ChatContainer

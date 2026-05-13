import { useChatStore } from '~/stores/useChatStore';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import MessageItem from './MessageItem';

const ChatWindowBody = () => {
  const { activeConversationId, conversations, messages: allMessages } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items ?? [];

  const selectedConver = conversations.find((c) => c._id === activeConversationId);

  if (!selectedConver) return <ChatWelcomeScreen />;

  if (!messages.length)
    return (
      <div className='flex items-center justify-center text-muted-foreground'>
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );

  return (
    <div className='p-4 bg-primary-foreground h-full flex flex-col overflow-hidden'>
      <div className='flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar'>
        {messages.map((mes, index) => (
          <MessageItem
            key={mes._id ?? index}
            message={mes}
            index={index}
            messages={messages}
            selectedConver={selectedConver}
            lastMessageStatus='delivered'
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;

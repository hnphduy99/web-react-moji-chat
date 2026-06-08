import { useEffect } from 'react';
import { useChatStore } from '~/stores/useChatStore';
import ChatWindowSkeleton from '../skeleton/ChatWindowSkeleton';
import { SidebarInset } from '../ui/sidebar';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import ChatWindowBody from './ChatWindowBody';
import ChatWindowHeader from './ChatWindowHeader';
import MessageInput from './MessageInput';

const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messagesLoading: loading, markAsSeen } = useChatStore();

  const selectedConver = conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectedConver) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error('Lỗi khi gọi markSeen', error);
      }
    };
    markSeen();
  }, [markAsSeen, selectedConver]);

  if (!selectedConver) return <ChatWelcomeScreen />;

  if (loading) return <ChatWindowSkeleton />;

  return (
    <SidebarInset className='flex flex-col flex-1 h-full overflow-hidden rounded-xl shadow-soft'>
      {/* Header */}
      <ChatWindowHeader chat={selectedConver} />
      {/* Body */}
      <div className='flex-1 overflow-hidden'>
        <ChatWindowBody />
      </div>
      {/* Footer */}
      <MessageInput selectedConver={selectedConver} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;

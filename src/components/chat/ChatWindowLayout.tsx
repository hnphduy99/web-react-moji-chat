import { useEffect } from 'react';
import { useChatStore } from '~/stores/useChatStore';
import { SidebarInset } from '../ui/sidebar';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import ChatWindowBody from './ChatWindowBody';
import ChatWindowHeader from './ChatWindowHeader';
import ChatWindowSkeleton from './ChatWindowSkeleton';
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
    <SidebarInset className='flex flex-1 fle-col h-full overflow-hidden rounded-sm shadow-md'>
      {/* Header */}
      <ChatWindowHeader chat={selectedConver} />
      {/* Body */}
      <div className='flex-1 overflow-y-auto bg-primary-foreground'>
        <ChatWindowBody />
      </div>
      {/* Footer */}
      <MessageInput selectedConver={selectedConver} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;

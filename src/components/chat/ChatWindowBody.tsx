import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useChatStore } from '~/stores/useChatStore';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import MessageItem from './MessageItem';

const ChatWindowBody = () => {
  const { activeConversationId, conversations, messages: allMessages, fetchMessages } = useChatStore();
  const [lastMessageStatus, setlastMessageStatus] = useState<'delivered' | 'seen'>('delivered');

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const reveredMessages = [...messages].reverse();
  const selectedConver = conversations.find((c) => c._id === activeConversationId);
  const key = `chat-scroll-${activeConversationId}`;

  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = selectedConver?.lastMessage;
    if (!lastMessage) return;
    const seenBy = selectedConver?.seenBy ?? [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setlastMessageStatus(seenBy.length > 0 ? 'seen' : 'delivered');
  }, [selectedConver]);

  useLayoutEffect(() => {
    if (!messageEndRef.current) return;

    requestAnimationFrame(() => {
      messageEndRef.current?.scrollIntoView({ block: 'end' });
    });
  }, [activeConversationId]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) return;
    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error('Lỗi xảy ra khi fetch thêm tin', error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight
      })
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);
    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [key, messages.length]);

  if (!selectedConver) return <ChatWelcomeScreen />;

  if (!messages.length)
    return (
      <div className='flex items-center justify-center text-muted-foreground'>
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );

  return (
    <div className='p-4 bg-primary-foreground h-full flex flex-col overflow-hidden'>
      <div
        ref={containerRef}
        id='scrollableDiv'
        onScroll={handleScrollSave}
        className='flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar'
      >
        <div ref={messageEndRef} />

        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget='scrollableDiv'
          loader={<p>Loading...</p>}
          inverse
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            overflow: 'visible'
          }}
        >
          {reveredMessages.map((mes, index) => (
            <MessageItem
              key={mes._id ?? index}
              message={mes}
              index={index}
              messages={reveredMessages}
              selectedConver={selectedConver}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;

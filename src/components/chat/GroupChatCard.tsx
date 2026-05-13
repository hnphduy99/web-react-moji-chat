import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import type { Conversation } from '~/types/chat';
import ChatCard from './ChatCard';
import GroupChatAvatar from './GroupChatAvatar';
import UnreadCountBadge from './UnreadCountBadge';

const GroupChatCard = ({ data }: { data: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

  if (!user) return null;

  const unreadCount = data.unreadCounts[user._id];
  const name = data.group?.name ?? '';

  const hanleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  return (
    <ChatCard
      dataId={data._id}
      name={name}
      timestamps={data.lastMessage?.createdAt ? new Date(data.lastMessage.createdAt) : undefined}
      onSelect={hanleSelectConversation}
      unreadCounts={unreadCount}
      isActive={activeConversationId === data._id}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar participants={data.participants} type='chat' />
        </>
      }
      subTitle={<p className={'text-sm truncate font-medium text-foreground'}>{data.participants.length} thành viên</p>}
    />
  );
};

export default GroupChatCard;

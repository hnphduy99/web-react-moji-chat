import { cn } from '~/lib/utils';
import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import type { Conversation } from '~/types/chat';
import ChatCard from './ChatCard';
import StatusBadge from './StatusBadge';
import UnreadCountBadge from './UnreadCountBadge';
import UserAvatar from './UserAvatar';

const DirectMessageCard = ({ data }: { data: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages } = useChatStore();

  if (!user) return null;

  const otherUser = data.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = data.unreadCounts[user._id];
  const lastMessage = data.lastMessage?.content ?? null;

  const hanleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      //todo: fetch message
    }
  };

  return (
    <ChatCard
      dataId={data._id}
      name={otherUser.displayName}
      timestamps={data.lastMessage?.createdAt ? new Date(data.lastMessage.createdAt) : undefined}
      onSelect={hanleSelectConversation}
      unreadCounts={unreadCount}
      isActive={activeConversationId === data._id}
      leftSection={
        <>
          <UserAvatar type='sidebar' name={otherUser.displayName} avatarUrl={otherUser.avatarUrl ?? undefined} />
          <StatusBadge status='offline' />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subTitle={
        <p
          className={cn('text-sm truncate', unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground')}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default DirectMessageCard;

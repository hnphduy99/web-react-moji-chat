import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import { useSocketStore } from '~/stores/useSocketStore';
import type { Conversation } from '~/types/chat';
import { SidebarTrigger } from '../ui/sidebar';
import GroupChatAvatar from './GroupChatAvatar';
import StatusBadge from './StatusBadge';
import UserAvatar from './UserAvatar';

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  let otherUser;

  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className='md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-background/80 backdrop-blur-sm border-gradient-bottom'>
        <SidebarTrigger className='-ml-1 text-foreground' />
      </header>
    );
  }

  if (chat.type === 'direct') {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
    if (!user || !otherUser) return;
  }

  const isOnline = chat.type === 'direct' && onlineUsers.includes(otherUser?._id ?? '');
  const participantCount = chat.participants.length;

  return (
    <header className='sticky top-0 z-10 flex items-center px-4 py-3 bg-background/85 backdrop-blur-md border-gradient-bottom'>
      <div className='flex items-center gap-3 w-full'>
        {/* Sidebar trigger */}
        <SidebarTrigger className='-ml-1 text-foreground hover:text-primary transition-colors' />

        {/* Divider */}
        <div className='w-px h-6 bg-border/50' />

        {/* Avatar + Info */}
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <div className='relative shrink-0'>
            {chat.type === 'direct' ? (
              <>
                <UserAvatar
                  type='sidebar'
                  name={otherUser?.displayName || 'Moji'}
                  avatarUrl={otherUser?.avatarUrl ?? undefined}
                />
                <StatusBadge status={isOnline ? 'online' : 'offline'} />
              </>
            ) : (
              <GroupChatAvatar participants={chat.participants} type='sidebar' />
            )}
          </div>

          <div className='flex flex-col min-w-0'>
            <h2 className='font-semibold text-foreground text-sm truncate leading-tight'>
              {chat.type === 'direct' ? otherUser?.displayName : chat.group?.name}
            </h2>
            <div className='flex items-center gap-1.5 mt-0.5'>
              {chat.type === 'direct' ? (
                isOnline ? (
                  <span className='text-xs text-[--online] font-medium'>Online</span>
                ) : (
                  <span className='text-xs text-muted-foreground'>Offline</span>
                )
              ) : (
                <span className='text-xs text-muted-foreground'>{participantCount} thành viên</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatWindowHeader;

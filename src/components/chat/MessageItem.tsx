import { cn, formatMessageTime } from '~/lib/utils';
import type { Conversation, Message } from '~/types/chat';
import UserAvatar from './UserAvatar';

interface IMessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConver: Conversation;
  lastMessageStatus: 'delivered' | 'seen';
}

const MessageItem = ({ message, index, messages, selectedConver, lastMessageStatus }: IMessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 || new Date(message.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 30000; //5phut

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConver.participants.find((p) => p._id.toString() === message.senderId.toString());

  return (
    <>
      {isShowTime && (
        <div className='flex items-center gap-3 my-3 px-2'>
          <div className='flex-1 h-px bg-border/40' />
          <span className='text-xs text-muted-foreground/70 font-medium whitespace-nowrap'>
            {formatMessageTime(new Date(message.createdAt))}
          </span>
          <div className='flex-1 h-px bg-border/40' />
        </div>
      )}

      <div
        className={cn(
          'flex gap-2 message-bounce px-2',
          isGroupBreak ? 'mt-2' : 'mt-0.5',
          message.isOwn ? 'justify-end' : 'justify-start'
        )}
      >
        {/* Avatar vùng trái (received) */}
        {!message.isOwn && (
          <div className='w-8 shrink-0 flex items-end'>
            {isGroupBreak ? (
              <div className='animate-scale-in'>
                <UserAvatar
                  type='chat'
                  name={participant?.displayName || 'Moji'}
                  avatarUrl={participant?.avatarUrl ?? undefined}
                />
              </div>
            ) : (
              <div className='size-8' />
            )}
          </div>
        )}

        {/* Bubble */}
        <div className={cn('max-w-xs lg:max-w-md flex flex-col gap-1', message.isOwn ? 'items-end' : 'items-start')}>
          {/* Sender name for group chats */}
          {!message.isOwn && isGroupBreak && selectedConver.type === 'group' && (
            <span className='text-xs text-muted-foreground font-medium px-1 ml-1'>{participant?.displayName}</span>
          )}

          <div
            className={cn(
              'px-3.5 py-2.5 text-sm wrap-break-word shadow-sm',
              message.isOwn
                ? 'chat-bubble-sent bubble-sent'
                : 'chat-bubble-received bubble-received border border-border/40'
            )}
          >
            {message.content}
          </div>

          {/* Seen / delivered indicator */}
          {message.isOwn && message._id === selectedConver.lastMessage?._id && (
            <div className='flex items-center gap-1 mt-0.5 px-1'>
              {lastMessageStatus === 'seen' ? (
                <span className='text-xs text-primary font-medium'>Đã xem</span>
              ) : (
                <span className='text-xs text-muted-foreground'>Đã gửi</span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;

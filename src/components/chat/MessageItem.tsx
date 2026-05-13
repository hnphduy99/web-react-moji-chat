import { cn, formatMessageTime } from '~/lib/utils';
import type { Conversation, Message } from '~/types/chat';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import UserAvatar from './UserAvatar';

interface IMessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConver: Conversation;
  lastMessageStatus: 'delivered' | 'seen';
}

const MessageItem = ({ message, index, messages, selectedConver, lastMessageStatus }: IMessageItemProps) => {
  const prev = messages[index - 1];

  const isGroupBreak =
    index === 0 ||
    message.senderId !== prev?.senderId ||
    new Date(message.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 30000; //5phut

  const participant = selectedConver.participants.find((p) => p._id.toString() === message._id.toString());

  return (
    <div className={cn('flex gap-2 message-bounce', message.isOwn ? 'justify-end' : 'justify-start')}>
      {/* Avatarr */}
      {!message.isOwn && (
        <div className='w-8'>
          {isGroupBreak && (
            <UserAvatar
              type='chat'
              name={participant?.displayName || 'Moji'}
              avatarUrl={participant?.avatarUrl ?? undefined}
            />
          )}
        </div>
      )}
      {/* Tin nhắn */}
      <div className={cn('max-w-xs lg:max-w-md spcae-y-1 flex flex-col', message.isOwn ? 'items-end' : 'items-start')}>
        <Card className={cn('p-3', message.isOwn ? 'chat-bubble-sent border-0' : 'bg-chat-bubble-received')}>
          <p className='text-sm leading-relaxed wrap-break-word'>{message.content}</p>
        </Card>

        {isGroupBreak && (
          <span className='text-xs text-muted-foreground px-1'>{formatMessageTime(new Date(message.createdAt))}</span>
        )}

        {/* seen /deivered */}
        {message.isOwn && message._id === selectedConver.lastMessage?._id && (
          <Badge
            variant='outline'
            className={cn(
              'text-xs px-1.5 py-0.5 h-4 border-0',
              lastMessageStatus === 'seen' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            {lastMessageStatus}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

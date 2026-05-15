import type { ReactNode } from 'react';
import type { FriendRequest } from '~/types/user';
import UserAvatar from '../chat/UserAvatar';

interface RequestItemProps {
  request: FriendRequest;
  action: ReactNode;
  type: 'sent' | 'received';
}

const FriendRequestItem = ({ request, action, type }: RequestItemProps) => {
  if (!request) return;

  const info = type === 'sent' ? request.to : request.from;

  if (!info) return;
  return (
    <div
      className='flex items-center justify-between shadow-md border border-primary-foreground p-3 rounded-lg'
      key={info._id}
    >
      <div className='flex items-center gap-3'>
        <UserAvatar type='sidebar' name={info.displayName} avatarUrl={info.avatarUrl} />
        <div className='flex-1'>
          <p className='font-medium'>{info.displayName}</p>
          <p className='text-sm text-muted-foreground'>{info.username}</p>
        </div>
      </div>
      {action}
    </div>
  );
};

export default FriendRequestItem;

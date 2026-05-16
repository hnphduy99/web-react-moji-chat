import { X } from 'lucide-react';
import type { Friend } from '~/types/user';
import UserAvatar from '../chat/UserAvatar';

interface SelectedUserListProps {
  invitedUser: Friend[];
  onRemove: (friend: Friend) => void;
}

const SelectedUserList = ({ invitedUser, onRemove }: SelectedUserListProps) => {
  if (invitedUser.length === 0) return;
  return (
    <div className='flex flex-warp gap-2 pt-2'>
      {invitedUser.map((user) => (
        <div key={user._id} className='flex items-center gap-1 bg-muted text-sm rounded-full px-3 py-1'>
          <UserAvatar type='chat' name={user.displayName} avatarUrl={user.avatarUrl} />
          <span>{user.displayName}</span>
          <X className='size-3 cursor-pointer hover:text-destructive' onClick={() => onRemove(user)}></X>
        </div>
      ))}
    </div>
  );
};

export default SelectedUserList;

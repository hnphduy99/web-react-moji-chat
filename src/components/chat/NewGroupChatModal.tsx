import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChatStore } from '~/stores/useChatStore';
import { useFriendStore } from '~/stores/useFriendStore';
import type { Friend } from '~/types/user';
import InviteSuggestionList from '../newGroupChat/InviteSuggestionList';
import SelectedUserList from '../newGroupChat/SelectedUserList';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const { friends, getFriends } = useFriendStore();
  const [invitedUser, setInvitedUser] = useState<Friend[]>([]);
  const { createConversation, loading } = useChatStore();
  const handleGetFriends = async () => {
    await getFriends();
  };

  const filteredFriends = friends.filter(
    (f) => f.displayName.toLowerCase().includes(search.toLowerCase()) && !invitedUser.some((u) => u._id === f._id)
  );

  const handleSelect = (friend: Friend) => {
    setInvitedUser((prev) => [...prev, friend]);
    setSearch('');
  };

  const handleRemove = (friend: Friend) => {
    setInvitedUser((prev) => prev.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      if (invitedUser.length === 0) {
        toast.warning('Bạn phải mời ít nhất 1 thành viên vào nhóm');
        return;
      }
      await createConversation(
        'group',
        groupName,
        invitedUser.map((u) => u._id)
      );
      setSearch('');
      setInvitedUser([]);
    } catch (error) {
      console.error('Lỗi xảy ra khi handleSubmit trong NewGroupChatModal: ', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div
            onClick={handleGetFriends}
            className='flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer'
          >
            <Users className='size-4' />
            <span className='sr-only'>Tạo nhóm</span>
          </div>
        }
      />
      <DialogContent className='sm:max-w-106.25 border-none'>
        <DialogHeader>
          <DialogTitle className='capitalize'>tạo nhóm chat mới</DialogTitle>
        </DialogHeader>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='groupName' className='text-sm font-semibold'>
              Tên nhóm
            </Label>
            <Input
              id='groupName'
              placeholder='Gõ tên nhóm vào đây...'
              className='glass border-border/50 focus:border-primary/50 transition-smooth'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='invite' className='text-sm font-semibold'>
              Mời thành viên
            </Label>
            <Input
              id='invite'
              placeholder='Tìm theo tên hiển thị...'
              className='glass border-border/50 focus:border-primary/50 transition-smooth'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && filteredFriends.length > 0 && (
              <InviteSuggestionList filteredFriends={filteredFriends} onSelect={handleSelect} />
            )}

            <SelectedUserList invitedUser={invitedUser} onRemove={handleRemove} />
          </div>
          <DialogFooter>
            <Button
              type='submit'
              disabled={loading}
              className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
            >
              {loading ? (
                <span>Đang tạo...</span>
              ) : (
                <>
                  <UserPlus className='size-4 mr-2' />
                  Tạo nhóm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;

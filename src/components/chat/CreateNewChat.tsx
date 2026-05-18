import { MessageCircle } from 'lucide-react';
import { useFriendStore } from '~/stores/useFriendStore';
import FriendListModal from '../createNewChat/FriendListModal';
import { Card } from '../ui/card';
import { Dialog, DialogTrigger } from '../ui/dialog';

const CreateNewChat = () => {
  const { getFriends } = useFriendStore();

  const handleGetFriend = async () => {
    await getFriends();
  };

  return (
    <div className='flex gap-2'>
      <Card className='flex-1 p-3 glass hover:shadow-soft transiion-smooth cursor-pointer group/card'>
        <Dialog>
          <DialogTrigger
            nativeButton={false}
            onClick={handleGetFriend}
            render={
              <div className='flex items-center gap-4'>
                <div className='size-8 bg-gradient-chat rounded-full flex items-center justify-center group-hover/card:scale-110 transition-bounce'>
                  <MessageCircle className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm capitalize'>Gửi tin nhắn mới</span>
              </div>
            }
          />
          <FriendListModal />
        </Dialog>
      </Card>
    </div>
  );
};

export default CreateNewChat;

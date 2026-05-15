import { toast } from 'sonner';
import { useFriendStore } from '~/stores/useFriendStore';
import { Button } from '../ui/button';
import FriendRequestItem from './FriendRequestItem';

const ReceivedRequest = () => {
  const { receivedList, acceptRequest, declineRequest, loading } = useFriendStore();

  if (!receivedList || receivedList.length === 0)
    return <p className='text-sm text-muted-foreground'>Bạn chưa có lời mời kết bạn nào</p>;

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success('Chấp nhận lời mời kết bạn thành công');
    } catch (error) {
      console.error('Lỗi xảy ra khi acceptRequest', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info('Đã từ chối lời mời kết bạn');
    } catch (error) {
      console.error('Lỗi xảy ra khi declineRequest', error);
    }
  };

  return (
    <div className='space-y-3 mt-4'>
      {receivedList.map((user) => (
        <FriendRequestItem
          key={user._id}
          request={user}
          type='received'
          action={
            <div className='flex gap-2'>
              <Button size='sm' variant='primary' onClick={() => handleAccept(user._id)} disabled={loading}>
                Chấp nhận
              </Button>
              <Button size='sm' variant='destructiveOutline' onClick={() => handleDecline(user._id)} disabled={loading}>
                Từ chối
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequest;

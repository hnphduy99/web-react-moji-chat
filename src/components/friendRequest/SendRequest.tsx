import { useFriendStore } from '~/stores/useFriendStore';
import FriendRequestItem from './FriendRequestItem';

const SendRequest = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0)
    return <p className='text-sm text-muted-foreground'>Bạn chưa có lời mời kết bạn nào</p>;

  return (
    <div className='space-y-3 mt-4'>
      {sentList.map((user) => (
        <FriendRequestItem
          key={user._id}
          request={user}
          type='sent'
          action={<p className='text-muted-foreground text-sm'>Đang chờ trả lời...</p>}
        />
      ))}
    </div>
  );
};

export default SendRequest;

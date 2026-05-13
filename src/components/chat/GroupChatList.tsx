import { useChatStore } from '~/stores/useChatStore';
import GroupChatCard from './GroupChatCard';

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const groupChats = conversations.filter((i) => i.type === 'group');

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {groupChats.map((data) => (
        <GroupChatCard data={data} key={data._id} />
      ))}
    </div>
  );
};

export default GroupChatList;

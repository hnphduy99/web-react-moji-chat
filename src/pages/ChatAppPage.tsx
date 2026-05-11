import Logout from '~/components/auth/logout';
import { useAuthStore } from '~/stores/useAuthStore';

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      {user?.username}
      <Logout></Logout>
    </div>
  );
};

export default ChatAppPage;

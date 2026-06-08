import ChatWindowLayout from '~/components/chat/ChatWindowLayout';
import { AppSidebar } from '~/components/sidebar/app-sidebar';
import { SidebarProvider } from '~/components/ui/sidebar';

const ChatAppPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex h-screen w-full p-2 gap-2 bg-muted/30'>
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatAppPage;

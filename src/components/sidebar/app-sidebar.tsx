'use client';

import { MessageCircleMore, Moon, Search, Sun } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar';
import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import { useThemeStore } from '~/stores/useThemeStore';
import AddFriendModal from '../chat/AddFriendModal';
import CreateNewChat from '../chat/CreateNewChat';
import DirectMessageList from '../chat/DirectMessageList';
import GroupChatList from '../chat/GroupChatList';
import NewGroupChatModal from '../chat/NewGroupChatModal';
import ConversationSkeleton from '../skeleton/ConversationSkeleton';
import { Switch } from '../ui/switch';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { conversationLoading } = useChatStore();

  return (
    <Sidebar variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader className='pb-0'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' className='bg-gradient-primary hover:opacity-90 transition-opacity'>
              <a href='#' className='w-full'>
                <div className='flex items-center px-1 w-full justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='size-7 rounded-lg bg-white/20 flex items-center justify-center'>
                      <span className='text-base'>
                        <MessageCircleMore className='text-4xl text-white' />
                      </span>
                    </div>
                    <h1 className='text-lg font-bold text-white tracking-wide'>Moji</h1>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Sun className='size-3.5 text-white/70' />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className='data-[state=checked]:bg-background/30 scale-90'
                    />
                    <Moon className='size-3.5 text-white/70' />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Search bar */}
        <div className='px-1 pb-2 pt-1'>
          <div className='flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/40 hover:border-border/70 transition-colors'>
            <Search className='size-3.5 text-muted-foreground shrink-0' />
            <span className='text-sm text-muted-foreground/60 select-none'>Tìm kiếm...</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className='beautiful-scrollbar pt-1'>
        {/* New chat */}
        <SidebarGroup className='py-1'>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group chat */}
        <SidebarGroup className='py-1'>
          <SidebarGroupLabel className='uppercase text-xs tracking-wider text-muted-foreground/70 font-semibold'>
            Nhóm chat
          </SidebarGroupLabel>
          <SidebarGroupAction title='Tạo nhóm' className='cursor-pointer hover:text-primary transition-colors'>
            <NewGroupChatModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            {conversationLoading ? <ConversationSkeleton /> : <GroupChatList />}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup className='py-1'>
          <SidebarGroupLabel className='uppercase text-xs tracking-wider text-muted-foreground/70 font-semibold'>
            Bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title='Thêm bạn' className='cursor-pointer hover:text-primary transition-colors'>
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            {conversationLoading ? <ConversationSkeleton /> : <DirectMessageList />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className='border-t border-border/30 pt-2'>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}

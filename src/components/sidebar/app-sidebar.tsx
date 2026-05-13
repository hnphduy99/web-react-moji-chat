'use client';

import { Moon, Sun } from 'lucide-react';
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
import { useThemeStore } from '~/stores/useThemeStore';
import AddFriendModal from '../chat/AddFriendModal';
import CreateNewChat from '../chat/CreateNewChat';
import { DirectMessage } from '../chat/DirectMessage';
import GroupChatList from '../chat/GroupChatList';
import NewGroupChatModal from '../chat/NewGroupChatModal';
import { Switch } from '../ui/switch';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Sidebar variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' className='bg-gradient-primary'>
              <a href='#' className='w-full'>
                <div className='flex items-center px-2 w-full justify-between'>
                  <h1 className='text-xl font-bold text-white'>Moji</h1>
                  <div className='flex items-center gap-2'>
                    <Sun className='size-4 text-white/80' />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className='data-[state=checked]:bg-background/80'
                    />
                    <Moon className='size-4 text-white/80' />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group chat */}
        <SidebarGroup>
          <SidebarGroupLabel className='uppercase'>nhóm chat</SidebarGroupLabel>
          <SidebarGroupAction title='Tạo nhóm' className='cursor-pointer'>
            <NewGroupChatModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup>
          <SidebarGroupLabel className='uppercase'>bạn bè</SidebarGroupLabel>
          <SidebarGroupAction title='Tạo nhóm' className='cursor-pointer'>
            <AddFriendModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <DirectMessage />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}

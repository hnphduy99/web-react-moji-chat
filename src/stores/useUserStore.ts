import { toast } from 'sonner';
import { create } from 'zustand';
import { userService } from '~/services/userService';
import type { UserState } from '~/types/store';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({ ...user, avatarUrl: data.avatarUrl });

        useChatStore.getState().fetchConversation();
      }

      toast.success('Câp nhật avatar thành công');
    } catch (error) {
      console.error('Lỗi khi updateAvatarUrl: ', error);
      toast.error('Câp nhật avatar không thành công');
    }
  }
}));

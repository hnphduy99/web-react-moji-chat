import { toast } from 'sonner';
import { create } from 'zustand';
import { authService } from '~/services/authService';
import type { AuthState } from '~/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken: string) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstname, lastname) => {
    try {
      set({ loading: true });
      //gọi api
      await authService.signUp(username, password, email, firstname, lastname);

      toast.success('Đăng ký thành công! bạn sẽ được chuyển sang trang đăng nhập.');
    } catch (error) {
      console.log(error);
      toast.error('Đăng ký không thành công');
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });
      //gọi api
      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();

      toast.success('Đăng nhập thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Đăng nhập không thành công');
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success('Logout thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Đăng xuất không thành công');
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.log(error);
      set({ user: null, accessToken: null });
      toast.error('Không lấy được thông tin user');
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.log(error);
      get().clearState();
      toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
    } finally {
      set({ loading: false });
    }
  }
}));

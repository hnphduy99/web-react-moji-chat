import api from '~/lib/axios';
import type { User } from '~/types/user';

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post('/users/uploadAvatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    if (res.status === 400) throw new Error(res.data.message);

    return res.data;
  },

  updateUserInfo: async (userData: Partial<User>) => {
    const res = await api.put('/users/updateProfile', userData);

    if (res.status === 400) throw new Error(res.data.message);

    return res.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.put('/users/changePassword', { currentPassword, newPassword });

    if (res.status === 400) throw new Error(res.data.message);

    return res.data;
  }
};

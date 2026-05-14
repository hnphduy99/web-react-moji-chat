import { io, type Socket } from 'socket.io-client';
import { create } from 'zustand';
import type { SocketState } from '~/types/store';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ['websocket']
    });

    set({ socket });

    socket.on('connect', () => {
      console.log(`socket connected`);
    });

    socket.on('online-users', (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on('new-message', ({ message, conversation, unreadCounts }) => {
      console.log('🚀 ~ message:', message);
      useChatStore.getState().addMessage(message);
      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: '',
          avatarUrl: null
        }
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) {
        // đánh dấu đã đọc
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));

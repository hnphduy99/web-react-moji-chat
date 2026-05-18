import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '~/services/chatService';
import type { ChatState } from '~/types/store';
import { useAuthStore } from './useAuthStore';
import { useSocketStore } from './useSocketStore';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      conversationLoading: false,
      messagesLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({ conversations: [], messages: {}, activeConversationId: null, conversationLoading: false });
      },
      fetchConversation: async () => {
        try {
          set({ conversationLoading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations, conversationLoading: false });
        } catch (error) {
          console.log('Lỗi xảy ra khi fetchConversations', error);
          set({ conversationLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const converId = conversationId ?? activeConversationId;

        if (!converId) return;

        const current = messages?.[converId];
        const nextCursor = current?.nextCursor === undefined ? '' : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messagesLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(converId, nextCursor);

          const processd = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id
          }));

          set((state) => {
            const prev = state.messages[converId]?.items ?? [];
            const merged = prev.length > 0 ? [...processd, ...prev] : processd;

            return {
              messages: {
                ...state.messages,
                [converId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null
                }
              }
            };
          });
        } catch (error) {
          console.log('Lỗi xảy ra khi fetchMessages:', error);
        } finally {
          set({ messagesLoading: false });
        }
      },
      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(recipientId, content, imgUrl, activeConversationId || undefined);

          set((state) => ({
            conversations: state.conversations.map((c) => (c._id === activeConversationId ? { ...c, seenBy: [] } : c))
          }));
        } catch (error) {
          console.log('Lỗi xảy ra khi gọi sendDirectMessage:', error);
        }
      },
      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendGroupMessage(conversationId, content, imgUrl);

          set((state) => ({
            conversations: state.conversations.map((c) => (c._id === activeConversationId ? { ...c, seenBy: [] } : c))
          }));
        } catch (error) {
          console.log('Lỗi xảy ra khi gọi sendGroupMessage:', error);
        }
      },
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const converId = message.conversationId;

          let prevItems = get().messages[converId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[converId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [converId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[converId]?.hasMore ?? false,
                  nextCursor: state.messages[converId]?.nextCursor ?? undefined
                }
              }
            };
          });
        } catch (error) {
          console.error('lỗi xảy ra khi addMessage: ', error);
        }
      },
      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) => (c._id === conversation._id ? { ...c, ...conversation } : c))
        }));
      },
      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const conversation = conversations.find((c) => c._id === activeConversationId);

          if (!conversation) return;

          if ((conversation.unreadCounts[user._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? { ...c, unreadCounts: { ...c.unreadCounts, [user._id]: 0 } }
                : c
            )
          }));
        } catch (error) {
          console.log('Lỗi xảy ra khi gọi markAsSeen trong useChatStore:', error);
        }
      },
      addConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some((c) => c._id === conversation._id);
          return {
            conversations: exists ? state.conversations : [conversation, ...state.conversations],
            activeConversationId: conversation._id
          };
        });
        get().fetchMessages(conversation._id);
      },
      createConversation: async (type, name, memberIds) => {
        try {
          set({ loading: true });
          const conversation = await chatService.createConversation(type, name, memberIds);
          get().addConversation(conversation);
          useSocketStore.getState().socket?.emit('join-conversation', conversation._id);
        } catch (error) {
          console.error('Lỗi xảy ra khi gọi createConversation trong useChatStore:', error);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations
      })
    }
  )
);

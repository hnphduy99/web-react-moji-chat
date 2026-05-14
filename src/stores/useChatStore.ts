import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '~/services/chatService';
import type { ChatState } from '~/types/store';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      conversationLoading: false,
      messagesLoading: false,

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
          await chatService.sendDirectMessage(conversationId, content, imgUrl);

          set((state) => ({
            conversations: state.conversations.map((c) => (c._id === activeConversationId ? { ...c, seenBy: [] } : c))
          }));
        } catch (error) {
          console.log('Lỗi xảy ra khi gọi sendGroupMessage:', error);
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

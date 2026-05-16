import api from '~/lib/axios';
import type { ConversationResponse, Message } from '~/types/chat';

interface IFetchMessegesProps {
  messages: Message[];
  cursor?: string;
}

const PAGE_LIMIT = 50;

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const res = await api.get('/conversations');
    return res.data;
  },

  async fetchMessages(id: string, cursor?: string): Promise<IFetchMessegesProps> {
    const url = `/conversations/${id}/messages?limit=${PAGE_LIMIT}`;
    const res = await api.get(cursor ? `${url}&nextCursor=${cursor}` : url);
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(recipientId: string, content: string, imgUrl?: string, conversationId?: string) {
    const res = await api.post('/messages/direct', {
      recipientId,
      content,
      imgUrl,
      conversationId
    });
    return res.data.messages;
  },

  async sendGroupMessage(conversationId: string, content: string = '', imgUrl?: string) {
    const res = await api.post('/messages/group', {
      conversationId,
      content,
      imgUrl
    });
    return res.data.messages;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data;
  },

  async createConversation(type: 'direct' | 'group', name: string, memberIds: string[]) {
    const res = await api.post('/conversations', { type, name, memberIds });
    return res.data.conversation;
  }
};

import { ChatData, ChatModel } from '@/modules/chat/models/chat-model';

export type UpdateChat = {
  updateChat(data: any, userId: string, chatId: string): Promise<any>;
};

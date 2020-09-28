import { ChatModel } from '../../models/chat-model';

export interface LoadMessagesByPageRepository {
  chat: ChatModel;
  loadMessagesByPage(
    page: number,
    chatId: string,
    userId: string,
  ): Promise<ChatModel>;
}

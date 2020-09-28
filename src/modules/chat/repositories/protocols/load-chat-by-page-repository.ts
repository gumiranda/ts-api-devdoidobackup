import { ChatModel } from '../../models/chat-model';

export interface LoadChatByPageRepository {
  chats: Omit<ChatModel, 'messages'>[];
  loadByPage(
    page: number,
    userId: string,
  ): Promise<Omit<ChatModel, 'messages'>[]>;
  countChatsByPage(userId: string): Promise<number>;
}

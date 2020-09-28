import { ChatModel } from '../../models/chat-model';

export interface LoadMessagesByPage {
  loadMessagesByPage(
    page: number,
    chatId: string,
    userId: string,
  ): Promise<ChatModel>;
}

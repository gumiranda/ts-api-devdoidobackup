import { ChatData, ChatModel } from '../../models/chat-model';

export interface UpdateChatRepository {
  chatModel: ChatModel;
  updateOne(userData: any, userId: string, chatId: string): Promise<any>;
}

import { ChatModel } from '../../models/chat-model';

export interface LoadChatByIdRepository {
  chatModel: ChatModel;
  chat_id: string;
  loadById(chat_id: string): Promise<ChatModel>;
}

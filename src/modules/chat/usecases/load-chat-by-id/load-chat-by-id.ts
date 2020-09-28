import { ChatModel } from '../../models/chat-model';

export interface LoadChatById {
  loadById(_id: string): Promise<ChatModel>;
}

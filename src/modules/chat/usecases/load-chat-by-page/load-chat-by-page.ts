import { ChatsPaginate } from '../../models/chat-model';

export interface LoadChatByPage {
  loadByPage(page: number, userId: string): Promise<ChatsPaginate>;
}

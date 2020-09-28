import { ChatModel } from '@/modules/chat/models/chat-model';
import { LoadChatByIdRepository } from '@/modules/chat/repositories/protocols/load-chat-by-id-repository';
import { LoadChatById } from '../load-chat-by-id';

export class DbLoadChatById implements LoadChatById {
  constructor(
    private readonly loadChatByIdRepository: LoadChatByIdRepository,
  ) {}
  async loadById(chat_id: string): Promise<ChatModel> {
    if (chat_id) {
      const chat = await this.loadChatByIdRepository.loadById(chat_id);
      if (chat) {
        return chat;
      }
    }
    return null;
  }
}

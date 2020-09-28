import { ChatsPaginate } from '@/modules/chat/models/chat-model';
import { LoadChatByPageRepository } from '@/modules/chat/repositories/protocols/load-chat-by-page-repository';
import { LoadChatByPage } from '../load-chat-by-page';

export class DbLoadChatByPage implements LoadChatByPage {
  constructor(private readonly loadChatRepository: LoadChatByPageRepository) {}
  async loadByPage(page: number, userId: string): Promise<ChatsPaginate> {
    const chats = await this.loadChatRepository.loadByPage(page, userId);
    const chatsCount = await this.loadChatRepository.countChatsByPage(userId);
    return { chats, chatsCount };
  }
}

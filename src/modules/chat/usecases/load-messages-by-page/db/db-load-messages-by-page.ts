import { ChatModel, ChatsPaginate } from '@/modules/chat/models/chat-model';
import { LoadChatByPageRepository } from '@/modules/chat/repositories/protocols/load-chat-by-page-repository';
import { LoadMessagesByPageRepository } from '@/modules/chat/repositories/protocols/load-messages-by-page-repository';
import { LoadMessagesByPage } from '../load-messages-by-page';

export class DbLoadMessagesByPage implements LoadMessagesByPage {
  constructor(
    private readonly loadChatRepository: LoadMessagesByPageRepository,
  ) {}
  async loadMessagesByPage(
    page: number,
    chatId: string,
    userId: string,
  ): Promise<ChatModel> {
    console.log(page, chatId, userId);
    const chat = await this.loadChatRepository.loadMessagesByPage(
      page,
      chatId,
      userId,
    );
    console.log(chat);
    if (chat) {
      return chat;
    }
    return null;
  }
}

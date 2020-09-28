import { ChatData, ChatModel } from '@/modules/chat/models/chat-model';
import { UpdateChatRepository } from '@/modules/chat/repositories/protocols/update-chat-repository';
import { UpdateChat } from '../update-chat';

export class DbUpdateChat implements UpdateChat {
  constructor(private readonly updateChatRepository: UpdateChatRepository) {}
  async updateChat(data: any, userId: string, chatId: string): Promise<any> {
    const chatResult = await this.updateChatRepository.updateOne(
      data,
      userId,
      chatId,
    );
    return chatResult;
  }
}

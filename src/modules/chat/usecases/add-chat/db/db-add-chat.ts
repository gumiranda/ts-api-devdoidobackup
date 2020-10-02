import OneSignal from '@/bin/helpers/external-apis/onesignal';
import { ChatModel } from '@/modules/chat/models/chat-model';
import { AddChatRepository } from '@/modules/chat/repositories/protocols/add-chat-repository';
import {
  AddChat,
  AddChatModel,
} from '@/modules/chat/usecases/add-chat/add-chat';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
export class DbAddChat implements AddChat {
  constructor(
    private readonly addChatRepository: AddChatRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  async add(data: AddChatModel): Promise<ChatModel> {
    const chat = await this.addChatRepository.add(data);
    if (chat) {
      return chat;
    }
    return null;
  }
}

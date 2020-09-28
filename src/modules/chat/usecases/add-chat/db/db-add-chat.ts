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
    const userFor = await this.loadUserByIdRepository.loadById(data.userFor);
    const userBy = await this.loadUserByIdRepository.loadById(data.userBy);
    if (userFor?.pushId && userBy?.name) {
      await OneSignal.sendNotification(
        userFor.pushId,
        userBy.name,
        data.content,
      );
    }
    if (chat) {
      return chat;
    }
    return null;
  }
}

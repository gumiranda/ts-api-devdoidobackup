import { AddChatModel } from '@/modules/chat/usecases/add-chat/add-chat';
import { ChatModel } from '../../models/chat-model';

export interface AddChatRepository {
  add(chatData: AddChatModel): Promise<ChatModel>;
}

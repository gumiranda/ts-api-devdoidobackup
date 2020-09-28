import { ChatModel } from '@/modules/chat/models/chat-model';

export type AddChatModel = Omit<ChatModel, '_id'>;

export type AddChat = {
  add(data: AddChatModel): Promise<ChatModel>;
};

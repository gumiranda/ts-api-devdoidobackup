import {
  makeFakeArrayChats,
  mockFakeChat,
  mockFakeChatUpdated,
} from '../../models/mocks/mock-chat';
import { ChatData, ChatModel, ChatsPaginate } from '../../models/chat-model';
import { AddChat, AddChatModel } from '../add-chat/add-chat';
import { LoadChatById } from '../load-chat-by-id/load-chat-by-id';
import { LoadChatByPage } from '../load-chat-by-page/load-chat-by-page';
import { UpdateChat } from '../update-chat/update-chat';

export const mockAddChat = (): AddChat => {
  class AddChatStub implements AddChat {
    chatModel = mockFakeChat();
    async add(chat: AddChatModel): Promise<ChatModel> {
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new AddChatStub();
};
export const mockLoadChatByPage = (): LoadChatByPage => {
  class LoadChatByPageStub implements LoadChatByPage {
    chats = makeFakeArrayChats();
    page: number;
    chatId: string;
    loadByPage(page: number, chatId: string): Promise<ChatsPaginate> {
      this.page = page;
      this.chatId = chatId;
      return new Promise((resolve) =>
        resolve({
          chats: this.chats.slice(0, 10),
          chatsCount: this.chats.length,
        }),
      );
    }
  }
  return new LoadChatByPageStub();
};
export const mockLoadChatById = (): LoadChatById => {
  class LoadChatByIdStub implements LoadChatById {
    chatModel = mockFakeChat();
    _id: string;
    async loadById(_id: string): Promise<ChatModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new LoadChatByIdStub();
};
export const mockUpdateChat = (): UpdateChat => {
  class UpdateChatStub implements UpdateChat {
    chatModel = mockFakeChatUpdated();
    async updateChat(chat: ChatData, chatId: string): Promise<ChatModel> {
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new UpdateChatStub();
};

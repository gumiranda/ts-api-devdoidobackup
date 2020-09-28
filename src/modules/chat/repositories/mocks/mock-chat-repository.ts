import {
  makeFakeArrayChats,
  mockFakeChat,
  mockFakeMessagesPaginated,
} from '../../models/mocks/mock-chat';
import { ChatData, ChatModel } from '../../models/chat-model';
import { AddChatRepository } from '../protocols/add-chat-repository';
import { LoadChatByIdRepository } from '../protocols/load-chat-by-id-repository';
import { LoadChatByPageRepository } from '../protocols/load-chat-by-page-repository';
import { UpdateChatRepository } from '../protocols/update-chat-repository';
import { LoadMessagesByPageRepository } from '../protocols/load-messages-by-page-repository';

export const mockUpdateChatRepository = (): UpdateChatRepository => {
  class UpdateChatRepositoryStub implements UpdateChatRepository {
    async updateOne(chatData: ChatData, chatId: string): Promise<ChatModel> {
      return new Promise((resolve) => resolve(this.chatModel));
    }
    chatModel = mockFakeChat();
  }
  return new UpdateChatRepositoryStub();
};

export const mockAddChatRepository = (): AddChatRepository => {
  class AddChatRepositoryStub implements AddChatRepository {
    chatModel = mockFakeChat();
    async add(chatData: Omit<ChatModel, '_id'>): Promise<ChatModel> {
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new AddChatRepositoryStub();
};

export const mockLoadChatByIdRepository = (): LoadChatByIdRepository => {
  class LoadChatByIdStub implements LoadChatByIdRepository {
    chat_id: string;
    chatModel = mockFakeChat();
    async loadById(chat_id: string): Promise<ChatModel> {
      this.chat_id = chat_id;
      if (this.chatModel !== null) {
        this.chatModel._id = chat_id;
      }
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new LoadChatByIdStub();
};
export const mockLoadMessagesByPageRepository = (): LoadMessagesByPageRepository => {
  class LoadMessagesByPageStub implements LoadMessagesByPageRepository {
    chat: ChatModel;
    chatModel = mockFakeMessagesPaginated();
    async loadMessagesByPage(
      page: number,
      chatId: string,
      userId: string,
    ): Promise<ChatModel> {
      if (this.chatModel !== null) {
        this.chatModel._id = chatId;
      }
      return new Promise((resolve) => resolve(this.chatModel));
    }
  }
  return new LoadMessagesByPageStub();
};
export const mockLoadChatByPageRepository = (): LoadChatByPageRepository => {
  class LoadChatByPageStub implements LoadChatByPageRepository {
    chats = makeFakeArrayChats();
    page: number;
    chatId: string;
    async loadByPage(
      page: number,
      chatId: string,
    ): Promise<Omit<ChatModel, 'messages'>[]> {
      this.chatId = chatId;
      this.page = page;
      return new Promise((resolve) => resolve(this.chats?.slice(0, 10)));
    }
    async countChatsByPage(chatId: string): Promise<number> {
      this.chatId = chatId;
      return new Promise((resolve) => resolve(this.chats?.length));
    }
  }
  return new LoadChatByPageStub();
};

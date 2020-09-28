import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ObjectId } from 'mongodb';
import { ChatData, ChatModel, Message } from '../models/chat-model';
import { AddChatRepository } from './protocols/add-chat-repository';
import { LoadChatByIdRepository } from './protocols/load-chat-by-id-repository';
import { LoadChatByPageRepository } from './protocols/load-chat-by-page-repository';
import { UpdateChatRepository } from './protocols/update-chat-repository';

export class ChatMongoRepository
  implements
    AddChatRepository,
    LoadChatByIdRepository,
    UpdateChatRepository,
    LoadChatByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  chatModel: ChatModel;
  chat_id: string;
  chats;
  async add(chatData: Omit<ChatModel, '_id'>): Promise<ChatModel> {
    const { userBy, userFor } = chatData;
    const chat: any = await this.mongoRepository.getOne(
      {
        $or: [
          {
            $and: [{ userBy }, { userFor }],
          },
          {
            $and: [{ userFor: userBy }, { userBy: userFor }],
          },
        ],
      },
      {
        projection: { messages: 0 },
      },
    );
    if (chat) {
      return chat;
    }
    const result = await this.mongoRepository.add(chatData);
    return result;
  }
  async updateOne(
    message: Omit<Message, 'createdAt' | 'user' | 'read'>,
    userId: string,
    chatId: string,
  ): Promise<any> {
    const { text } = message;
    const updated = await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(chatId),
      },
      {
        $set: { lastMessage: text },
        $push: {
          messages: {
            text,
            createdAt: new Date(),
            read: false,
            user: new ObjectId(userId),
          },
        },
        $inc: { countMessages: 1 },
      },
      { upsert: true },
    );
    return updated?.result?.ok;
  }

  async loadById(_id: string): Promise<ChatModel> {
    const chat = await this.mongoRepository.getById(_id);
    return chat;
  }
  countChatsByPage(userFor: string): Promise<number> {
    return this.mongoRepository.getCount({ userFor });
  }
  loadByPage(
    page: number,
    userId: string,
  ): Promise<Omit<ChatModel, 'messages'>[]> {
    return this.mongoRepository.getPaginate(
      page,
      {
        $or: [
          {
            $and: [{ userFor: { $ne: userId } }, { userBy: userId }],
          },
          {
            $and: [{ userBy: { $ne: userId } }, { userFor: userId }],
          },
        ],
      },
      { createdAt: -1 },
      10,
      { messages: 0 },
    );
  }
}

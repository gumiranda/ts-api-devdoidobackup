import { ChatMongoRepository } from './chat-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { mockFakeUserData } from '@/modules/user/models/mocks/mock-user';
import { UserModel } from '@/modules/user/models/user-model';
import {
  mockFakeChatData,
  makeFakeArrayChats,
} from '../models/mocks/mock-chat';
import { ChatModel } from '../models/chat-model';

let chatCollection: Collection;
let userCollection: Collection;

const makeChat = async (): Promise<ChatModel> => {
  let chat = mockFakeChatData();
  const { ops } = await chatCollection.insertOne(chat);
  return ops[0];
};
const makeUser = async (): Promise<UserModel> => {
  let user = mockFakeUserData('client');
  user.coord = { type: 'Point', coordinates: user.coord };
  const { ops } = await userCollection.insertOne(user);
  return ops[0];
};
const makeSut = (): ChatMongoRepository => {
  const mongoRepository = new MongoRepository('chats');
  return new ChatMongoRepository(mongoRepository);
};
describe('Chat Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    chatCollection = await MongoHelper.getCollection('chats');
    userCollection = await MongoHelper.getCollection('users');
    await chatCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  test('Should return an chat add success', async () => {
    const sut = makeSut();
    const chat = await sut.add(mockFakeChatData());
    expect(chat).toBeTruthy();
    expect(chat._id).toBeTruthy();
    expect(chat.lastMessage).toBe('lastMessage');
    expect(chat.userFor).toBe('userFor');
    expect(chat.userBy).toBe('userBy');
  });

  test('Should return an chat loaded by id with success', async () => {
    const chat = await makeChat();
    const sut = makeSut();
    const chatLoaded = await sut.loadById(chat._id);
    expect(chatLoaded).toBeTruthy();
    expect(chatLoaded._id).toBeTruthy();
    expect(chatLoaded._id).toEqual(chat._id);
  });
  test('Should return an chat loadByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    let arrayChats = makeFakeArrayChats();
    arrayChats.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await chatCollection.insertMany(arrayChats);
    const chats = await sut.loadByPage(1, user._id);
    expect(chats).toBeTruthy();
    expect(chats[0]).toBeTruthy();
    expect(chats[1]).toBeTruthy();
    expect(chats.length).toBe(10);
  });
  test('Should return an chat countChatsByPage success', async () => {
    const sut = makeSut();
    let arrayChats = makeFakeArrayChats();
    const user = await makeUser();
    arrayChats.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await chatCollection.insertMany(arrayChats);
    const chatsCounts = await sut.countChatsByPage(user._id);
    expect(chatsCounts).toBe(15);
  });
  test('Should return 0 on countChatsByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    const chatsCounts = await sut.countChatsByPage(user._id);
    expect(chatsCounts).toBe(0);
  });
  test('Should return an chat updated success', async () => {
    const chat = await makeChat();
    const user = await makeUser();
    const sut = makeSut();

    const chatUpdated = await sut.updateOne({ text: 'oi' }, user._id, chat._id);
    // expect(chatUpdated).toBeTruthy();
    // expect(chatUpdated._id).toBeTruthy();
    // expect(chatUpdated.countMessages).toBe(1);
    expect(chatUpdated).toBe(1);
  });
});

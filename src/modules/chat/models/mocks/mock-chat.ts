import { ChatsPaginate, ChatModel, Message } from '../chat-model';
export const mockFakeChatData = (): Omit<ChatModel, '_id'> => ({
  lastMessage: 'lastMessage',
  userFor: 'userFor',
  userBy: 'userBy',
  messages: [],
  countMessages: 0,
  createdAt: new Date(),
});
export const mockFakeChatWithoutMessages = (): Omit<ChatModel, 'messages'> => ({
  lastMessage: 'lastMessage',
  userFor: 'userFor',
  _id: 'any_id',
  userBy: 'userBy',
  countMessages: 0,
  createdAt: new Date(),
});
export const mockFakeChat = (): ChatModel => ({
  lastMessage: 'lastMessage',
  _id: 'any_id',
  userFor: 'userFor',
  userBy: 'userBy',
  messages: [],
  countMessages: 0,
  createdAt: new Date(),
});
const makeMessage = (): Message => ({
  read: false,
  text: 'lastMessage',
  createdAt: new Date(),
  user: 'user',
});
export const mockFakeMessagesPaginated = (): ChatModel => ({
  lastMessage: 'lastMessage',
  _id: 'any_id',
  userFor: 'userFor',
  userBy: 'userBy',
  messages: [
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
    makeMessage(),
  ],
  countMessages: 0,
  createdAt: new Date(),
});
export const mockFakeChatUpdated = (): ChatModel => ({
  lastMessage: 'lastMessage',
  _id: 'any_id',
  messages: [makeMessage()],
  countMessages: 1,
  userFor: 'userFor',
  userBy: 'userBy',
  createdAt: new Date(),
});

export const mockFakeChatsPaginated = (): ChatsPaginate => ({
  chats: makeFakeArrayChats().slice(0, 10),
  chatsCount: makeFakeArrayChats().length,
});

export const makeFakeArrayChats = (): Omit<ChatModel, 'messages'>[] => [
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
  mockFakeChatWithoutMessages(),
];

export const makeFakeArrayAddChats = (): Omit<ChatModel, '_id'>[] => [
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
  mockFakeChatData(),
];
export const mockFakeChatRequest = (userFor): any => ({
  userFor,
});

import { DbAddChat } from './db-add-chat';
import MockDate from 'mockdate';
import { mockFakeChat } from '@/modules/chat/models/mocks/mock-chat';
import { mockAddChatRepository } from '@/modules/chat/repositories/mocks/mock-chat-repository';
import { AddChatRepository } from '@/modules/chat/repositories/protocols/add-chat-repository';
import { mockLoadUserByIdRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

type SutTypes = {
  sut: DbAddChat;
  addChatStub: AddChatRepository;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};

const makeSut = (): SutTypes => {
  const addChatStub = mockAddChatRepository();
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbAddChat(addChatStub, loadUserByIdRepositoryStub);
  return {
    sut,
    addChatStub,
    loadUserByIdRepositoryStub,
  };
};
describe('DbAddChat', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddChatRepository with correct values', async () => {
    const { sut, addChatStub } = makeSut();
    const chatData = mockFakeChat();
    const addChatSpy = jest.spyOn(addChatStub, 'add');
    await sut.add(chatData);
    expect(addChatSpy).toHaveBeenCalledWith(chatData);
  });
  test('should throw if AddChatRepository throws', async () => {
    const { sut, addChatStub } = makeSut();
    const chatData = mockFakeChat();
    jest
      .spyOn(addChatStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(chatData);
    await expect(promise).rejects.toThrow();
  });
});

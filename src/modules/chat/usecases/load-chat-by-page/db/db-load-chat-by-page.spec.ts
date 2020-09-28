import { DbLoadChatByPage } from './db-load-chat-by-page';
import MockDate from 'mockdate';
import { mockFakeChatsPaginated } from '@/modules/chat/models/mocks/mock-chat';
import { mockLoadChatByPageRepository } from '@/modules/chat/repositories/mocks/mock-chat-repository';
import { LoadChatByPageRepository } from '@/modules/chat/repositories/protocols/load-chat-by-page-repository';
type SutTypes = {
  sut: DbLoadChatByPage;
  loadChatStub: LoadChatByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadChatStub = mockLoadChatByPageRepository();
  const sut = new DbLoadChatByPage(loadChatStub);
  return {
    sut,
    loadChatStub,
  };
};
describe('DbLoadChatByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadChatByPageRepository with correct values', async () => {
    const { sut, loadChatStub } = makeSut();
    const loadChatSpy = jest.spyOn(loadChatStub, 'loadByPage');
    await sut.loadByPage(1, 'chat_id');
    expect(loadChatSpy).toHaveBeenCalledWith(1, 'chat_id');
  });
  test('should call countChatsByPage with correct values', async () => {
    const { sut, loadChatStub } = makeSut();
    const countChatsByPageSpy = jest.spyOn(loadChatStub, 'countChatsByPage');
    await sut.loadByPage(1, 'chat_id');
    expect(countChatsByPageSpy).toHaveBeenCalledWith('chat_id');
  });
  test('should return chats on success', async () => {
    const { sut } = makeSut();
    const chats = await sut.loadByPage(1, 'chat_id');
    expect(chats).toEqual(mockFakeChatsPaginated());
  });
  test('should throw if LoadChatByPageRepository throws', async () => {
    const { sut, loadChatStub } = makeSut();
    jest
      .spyOn(loadChatStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'chat_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadChatByPageRepository throws', async () => {
    const { sut, loadChatStub } = makeSut();
    jest
      .spyOn(loadChatStub, 'countChatsByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'chat_id');
    await expect(promise).rejects.toThrow();
  });
});

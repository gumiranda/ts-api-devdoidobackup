import MockDate from 'mockdate';
import { mockFakeMessagesPaginated } from '@/modules/chat/models/mocks/mock-chat';
import { DbLoadMessagesByPage } from './db-load-messages-by-page';
import { mockLoadMessagesByPageRepository } from '@/modules/chat/repositories/mocks/mock-chat-repository';
import { LoadMessagesByPageRepository } from '@/modules/chat/repositories/protocols/load-messages-by-page-repository';
type SutTypes = {
  sut: DbLoadMessagesByPage;
  loadMessagesStub: LoadMessagesByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadMessagesStub = mockLoadMessagesByPageRepository();
  const sut = new DbLoadMessagesByPage(loadMessagesStub);
  return {
    sut,
    loadMessagesStub,
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
    const { sut, loadMessagesStub } = makeSut();
    const loadChatSpy = jest.spyOn(loadMessagesStub, 'loadMessagesByPage');
    await sut.loadMessagesByPage(1, 'chat_id', 'userid');
    expect(loadChatSpy).toHaveBeenCalledWith(1, 'chat_id', 'userid');
  });
  test('should return chats on success', async () => {
    const { sut } = makeSut();
    const chat = await sut.loadMessagesByPage(1, 'any_id', 'userid');
    expect(chat).toEqual(mockFakeMessagesPaginated());
  });
  test('should throw if LoadChatByPageRepository throws', async () => {
    const { sut, loadMessagesStub } = makeSut();
    jest
      .spyOn(loadMessagesStub, 'loadMessagesByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadMessagesByPage(1, 'chat_id', 'userid');
    await expect(promise).rejects.toThrow();
  });
});

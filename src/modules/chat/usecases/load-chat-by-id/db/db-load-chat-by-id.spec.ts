import { DbLoadChatById } from './db-load-chat-by-id';
import faker from 'faker-br';
import { LoadChatByIdRepository } from '@/modules/chat/repositories/protocols/load-chat-by-id-repository';
import { mockLoadChatByIdRepository } from '@/modules/chat/repositories/mocks/mock-chat-repository';
type SutTypes = {
  sut: DbLoadChatById;
  loadChatByIdRepositoryStub: LoadChatByIdRepository;
};
let chat_id: string;
const makeSut = (): SutTypes => {
  const loadChatByIdRepositoryStub = mockLoadChatByIdRepository();
  const sut = new DbLoadChatById(loadChatByIdRepositoryStub);
  return {
    sut,
    loadChatByIdRepositoryStub,
  };
};
describe('DbLoadChatById tests', () => {
  beforeEach(() => {
    chat_id = faker.random.uuid();
  });

  test('should call LoadChatByIdRepository with correct values', async () => {
    const { sut, loadChatByIdRepositoryStub } = makeSut();
    await sut.loadById(chat_id);
    expect(loadChatByIdRepositoryStub.chat_id).toBe(chat_id);
  });
  test('should return null if LoadChatByIdRepository returns null', async () => {
    const { sut, loadChatByIdRepositoryStub } = makeSut();
    loadChatByIdRepositoryStub.chatModel = null;
    const chat = await sut.loadById(chat_id);
    expect(chat).toBeNull();
  });
  test('should return chat if LoadChatByIdRepository returns an chat', async () => {
    const { sut, loadChatByIdRepositoryStub } = makeSut();
    const chat = await sut.loadById(chat_id);
    expect(chat).toEqual(loadChatByIdRepositoryStub.chatModel);
  });

  test('Should throw if LoadChatByIdRepository throws', async () => {
    const { sut, loadChatByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadChatByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(chat_id);
    await expect(promise).rejects.toThrow();
  });
});

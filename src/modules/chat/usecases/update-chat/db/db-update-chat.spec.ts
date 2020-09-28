import { mockUpdateChatRepository } from '@/modules/chat/repositories/mocks/mock-chat-repository';
import { UpdateChatRepository } from '@/modules/chat/repositories/protocols/update-chat-repository';
import MockDate from 'mockdate';
import { DbUpdateChat } from './db-update-chat';
import { mockFakeChat } from '../../../models/mocks/mock-chat';

type SutTypes = {
  sut: DbUpdateChat;
  updateChatRepositoryStub: UpdateChatRepository;
};

const makeSut = (): SutTypes => {
  const updateChatRepositoryStub = mockUpdateChatRepository();
  const sut = new DbUpdateChat(updateChatRepositoryStub);
  return {
    sut,
    updateChatRepositoryStub,
  };
};

describe('DbUpdateChat Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call UpdateChatRepository with correct values', async () => {
    const { sut, updateChatRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateChatRepositoryStub, 'updateOne');
    await sut.updateChat(mockFakeChat(), 'userBy', 'any_chat_id');
    expect(updateSpy).toHaveBeenCalledWith(
      mockFakeChat(),
      'userBy',
      'any_chat_id',
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, updateChatRepositoryStub } = makeSut();
    jest
      .spyOn(updateChatRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateChat(mockFakeChat(), 'userBy', 'any_chat_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return an chat on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeChat();
    const chat = await sut.updateChat(
      fakeUpdateObject,
      'userBy',
      'any_chat_id',
    );
    expect(chat.messages).toEqual(fakeUpdateObject.messages);
  });
});

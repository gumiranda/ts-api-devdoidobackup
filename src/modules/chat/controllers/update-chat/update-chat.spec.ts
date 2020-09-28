import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { UpdateChat } from '@/modules/chat/usecases/update-chat/update-chat';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockUpdateChat } from '@/modules/chat/usecases/mocks/mock-chat';
import { UpdateChatController } from './update-chat';
import { mockFakeChatUpdated } from '../../models/mocks/mock-chat';
import { putOk } from '../../../../bin/helpers/http-helper';
type SutTypes = {
  sut: UpdateChatController;
  updateChatStub: UpdateChat;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const updateChatStub = mockUpdateChat();
  const sut = new UpdateChatController(validatorStub, updateChatStub);
  return { sut, validatorStub, updateChatStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    message: { text: 'Oi' },
  },
  userId: 'any_user_id',
  params: {
    chatId: 'any_id',
  },
});
describe('UpdateChat Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const validatorSpy = jest.spyOn(validatorStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 400 if validation fails', async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce([new Error()]);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest([new Error()]));
  });
  test('should call UpdateChat with correct values', async () => {
    const { sut, updateChatStub } = makeSut();
    const updateChatSpy = jest.spyOn(updateChatStub, 'updateChat');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(updateChatSpy).toHaveBeenCalledWith(
      httpRequest.body,
      httpRequest.userId,
      httpRequest.params.chatId,
    );
  });
  test('should return 500 if UpdateChat throws', async () => {
    const { sut, updateChatStub } = makeSut();
    jest
      .spyOn(updateChatStub, 'updateChat')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 202 on success', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      putOk({ message: 'Mensagem enviada com sucesso' }),
    );
  });
});

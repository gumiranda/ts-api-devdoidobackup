import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, createdOk } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { AddChat } from '@/modules/chat/usecases/add-chat/add-chat';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddChat } from '@/modules/chat/usecases/mocks/mock-chat';
import { AddChatController } from './add-chat';
import { mockFakeChat } from '../../models/mocks/mock-chat';
type SutTypes = {
  sut: AddChatController;
  addChatStub: AddChat;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const addChatStub = mockAddChat();
  const sut = new AddChatController(validatorStub, addChatStub);
  return { sut, validatorStub, addChatStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    userFor: 'string',
    countMessages: 0,
    lastMessage: '',
    messages: [],
    userBy: 'string',
    createdAt: new Date(),
  },
  userId: 'string',
});
describe('AddChat Controller', () => {
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
  test('should call AddChat with correct values', async () => {
    const { sut, addChatStub } = makeSut();
    const addChatSpy = jest.spyOn(addChatStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addChatSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 500 if AddChat throws', async () => {
    const { sut, addChatStub } = makeSut();
    jest
      .spyOn(addChatStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(createdOk(mockFakeChat()));
  });
});

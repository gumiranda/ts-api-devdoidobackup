import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, createdOk } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { AddNotification } from '@/modules/notification/usecases/add-notification/add-notification';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddNotification } from '@/modules/notification/usecases/mocks/mock-notification';
import { AddNotificationController } from './add-notification';
import { mockFakeNotification } from '../../models/mocks/mock-notification';
type SutTypes = {
  sut: AddNotificationController;
  addNotificationStub: AddNotification;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const addNotificationStub = mockAddNotification();
  const sut = new AddNotificationController(validatorStub, addNotificationStub);
  return { sut, validatorStub, addNotificationStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    content: 'string',
    userFor: 'string',
    type: 'string',
    read: false,
    userBy: 'string',
    createdAt: new Date(),
  },
  userId: 'string',
});
describe('AddNotification Controller', () => {
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
  test('should call AddNotification with correct values', async () => {
    const { sut, addNotificationStub } = makeSut();
    const addNotificationSpy = jest.spyOn(addNotificationStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addNotificationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 500 if AddNotification throws', async () => {
    const { sut, addNotificationStub } = makeSut();
    jest
      .spyOn(addNotificationStub, 'add')
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
    expect(httpResponse).toEqual(createdOk(mockFakeNotification()));
  });
});

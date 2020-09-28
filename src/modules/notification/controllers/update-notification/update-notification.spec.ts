import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { UpdateNotification } from '@/modules/notification/usecases/update-notification/update-notification';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockUpdateNotification } from '@/modules/notification/usecases/mocks/mock-notification';
import { UpdateNotificationController } from './update-notification';
import { mockFakeNotificationReaded } from '../../models/mocks/mock-notification';
import { putOk } from '../../../../bin/helpers/http-helper';
type SutTypes = {
  sut: UpdateNotificationController;
  updateNotificationStub: UpdateNotification;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const updateNotificationStub = mockUpdateNotification();
  const sut = new UpdateNotificationController(
    validatorStub,
    updateNotificationStub,
  );
  return { sut, validatorStub, updateNotificationStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    read: true,
  },
  params: {
    notificationId: 'any_id',
  },
});
describe('UpdateNotification Controller', () => {
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
  test('should call UpdateNotification with correct values', async () => {
    const { sut, updateNotificationStub } = makeSut();
    const updateNotificationSpy = jest.spyOn(
      updateNotificationStub,
      'updateNotification',
    );
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(updateNotificationSpy).toHaveBeenCalledWith(
      httpRequest.body,
      httpRequest.params.notificationId,
    );
  });
  test('should return 500 if UpdateNotification throws', async () => {
    const { sut, updateNotificationStub } = makeSut();
    jest
      .spyOn(updateNotificationStub, 'updateNotification')
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
    expect(httpResponse).toEqual(putOk(mockFakeNotificationReaded()));
  });
});

import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { UpdateRequest } from '@/modules/request/usecases/update-request/update-request';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockUpdateRequest } from '@/modules/request/usecases/mocks/mock-request';
import { UpdateRequestController } from './update-request';
import { mockFakeRequestReaded } from '../../models/mocks/mock-request';
import { putOk } from '../../../../bin/helpers/http-helper';
type SutTypes = {
  sut: UpdateRequestController;
  updateRequestStub: UpdateRequest;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const updateRequestStub = mockUpdateRequest();
  const sut = new UpdateRequestController(validatorStub, updateRequestStub);
  return { sut, validatorStub, updateRequestStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    read: true,
  },
  params: {
    requestId: 'any_id',
  },
});
describe('UpdateRequest Controller', () => {
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
  test('should call UpdateRequest with correct values', async () => {
    const { sut, updateRequestStub } = makeSut();
    const updateRequestSpy = jest.spyOn(updateRequestStub, 'updateRequest');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(updateRequestSpy).toHaveBeenCalledWith(
      httpRequest.body,
      httpRequest.params.requestId,
    );
  });
  test('should return 500 if UpdateRequest throws', async () => {
    const { sut, updateRequestStub } = makeSut();
    jest
      .spyOn(updateRequestStub, 'updateRequest')
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
    expect(httpResponse).toEqual(putOk(mockFakeRequestReaded()));
  });
});

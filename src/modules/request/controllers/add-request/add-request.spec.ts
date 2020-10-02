import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, createdOk } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { AddRequest } from '@/modules/request/usecases/add-request/add-request';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddRequest } from '@/modules/request/usecases/mocks/mock-request';
import { AddRequestController } from './add-request';
import { mockFakeRequest } from '../../models/mocks/mock-request';
import { ObjectId } from 'mongodb';
type SutTypes = {
  sut: AddRequestController;
  addRequestStub: AddRequest;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const addRequestStub = mockAddRequest();
  const sut = new AddRequestController(validatorStub, addRequestStub);
  return { sut, validatorStub, addRequestStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    content: 'string',
    userFor: '5f36bcc7b104350034fec070',
    type: 'string',
    read: false,
    userBy: '5f36bcc7b104350034fec070',
    createdAt: new Date(),
  },
  userId: '5f36bcc7b104350034fec070',
});
const makeFakeRequestObjectId = (): HttpRequest => ({
  body: {
    content: 'string',
    userFor: new ObjectId('5f36bcc7b104350034fec070'),
    type: 'string',
    read: false,
    userBy: new ObjectId('5f36bcc7b104350034fec070'),
    createdAt: new Date(),
  },
  userId: 'string',
});
describe('AddRequest Controller', () => {
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
  test('should call AddRequest with correct values', async () => {
    const { sut, addRequestStub } = makeSut();
    const addRequestSpy = jest.spyOn(addRequestStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addRequestSpy).toHaveBeenCalledWith(makeFakeRequestObjectId().body);
  });
  test('should return 500 if AddRequest throws', async () => {
    const { sut, addRequestStub } = makeSut();
    jest
      .spyOn(addRequestStub, 'add')
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
    expect(httpResponse).toEqual(createdOk(mockFakeRequest()));
  });
});

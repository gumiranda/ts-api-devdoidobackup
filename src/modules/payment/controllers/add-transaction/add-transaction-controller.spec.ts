import { HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '@/bin/helpers/http-helper';
import { MissingParamError, EmailInUseError, ServerError } from '@/bin/errors';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';

import MockDate from 'mockdate';
import {
  mockFakeTransaction,
  mockFakeTransactionRequest,
} from '../../models/mocks/mock-transaction';
import { AddTransaction } from '../../usecases/add-transaction/add-transaction';
import { TransactionController } from './add-transaction-controller';
import { mockAddCard, mockLoadCardById } from '../../usecases/mocks/mock-card';
import {
  mockLoadUserById,
  mockUpdateUser,
} from '@/modules/user/usecases/mocks/mock-user';
import { LoadUserById } from '@/modules/user/usecases/load-user-by-id/load-user-by-id';
import { UpdateUser } from '@/modules/user/usecases/update-user/update-user';
import { AddCard } from '../../usecases/add-card/add-card';
import { LoadCardById } from '../../usecases/load-card-by-id/load-card-by-id';
import { mockAddTransaction } from '../../usecases/mocks/mock-transaction';
const makeFakeRequest = (): HttpRequest => ({
  body: mockFakeTransactionRequest(),
});
type SutTypes = {
  sut: TransactionController;
  addTransactionStub: AddTransaction;
  addCardStub: AddCard;
  loadCardByIdStub: LoadCardById;
  updateUserStub: UpdateUser;
  loadUserByIdStub: LoadUserById;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const addTransactionStub = mockAddTransaction();
  const addCardStub = mockAddCard();
  const loadCardByIdStub = mockLoadCardById();
  const loadUserByIdStub = mockLoadUserById();
  const updateUserStub = mockUpdateUser();
  const validationStub = mockValidation();
  const sut = new TransactionController(
    addTransactionStub,
    addCardStub,
    loadCardByIdStub,
    updateUserStub,
    loadUserByIdStub,
    validationStub,
  );
  return {
    addTransactionStub,
    addCardStub,
    loadCardByIdStub,
    updateUserStub,
    loadUserByIdStub,
    validationStub,
    sut,
  };
};
describe('Transaction Controller', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });
  test('Should return 500 if Validator throws', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 500 if AddTransaction throws', async () => {
    const { sut, addTransactionStub } = makeSut();
    jest.spyOn(addTransactionStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddTransaction with correct values', async () => {
    const { sut, addTransactionStub } = makeSut();
    const addSpy = jest.spyOn(addTransactionStub, 'add');
    await sut.handle(makeFakeRequest());
    const resExpected = mockFakeTransaction();
    delete resExpected._id;
    expect(addSpy).toHaveBeenCalledWith(resExpected);
  });
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    console.warn(httpResponse.body);
    expect(httpResponse).toEqual(ok(mockFakeTransaction()));
  });
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce([new MissingParamError('any_field')]);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest([new MissingParamError('any_field')]),
    );
  });
  test('Should return 500 if AddTransaction returns null', async () => {
    const { sut, addTransactionStub } = makeSut();
    jest
      .spyOn(addTransactionStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

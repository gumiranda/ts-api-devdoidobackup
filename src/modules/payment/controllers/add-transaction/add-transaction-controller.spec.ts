import { HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '@/bin/helpers/http-helper';
import { MissingParamError, ServerError } from '@/bin/errors';
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
import { AddCard } from '../../usecases/add-card/add-card';
import { LoadCardById } from '../../usecases/load-card-by-id/load-card-by-id';
import {
  mockPayAgain,
  mockPayOnce,
} from '../../usecases/mocks/mock-transaction';
import { AccessDeniedError } from '../../../../bin/errors/access-denied-error';
import { PayOnce } from '../../usecases/pay-once/pay-once';
import { PayAgain } from '../../usecases/pay-again/pay-again';
const makeFakeRequest = (): HttpRequest => ({
  body: mockFakeTransactionRequest(),
});
type SutTypes = {
  sut: TransactionController;
  payOnceStub: PayOnce;
  payAgainStub: PayAgain;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const payOnceStub = mockPayOnce();
  const payAgainStub = mockPayAgain();
  const validationStub = mockValidation();
  const sut = new TransactionController(
    payOnceStub,
    payAgainStub,
    validationStub,
  );
  return {
    payOnceStub,
    validationStub,
    payAgainStub,
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
  test('Should return 403 if PayOnce returns null', async () => {
    const { sut, payOnceStub } = makeSut();
    jest
      .spyOn(payOnceStub, 'payOnce')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test('Should return 500 if PayOnce throws', async () => {
    const { sut, payOnceStub } = makeSut();
    jest.spyOn(payOnceStub, 'payOnce').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});

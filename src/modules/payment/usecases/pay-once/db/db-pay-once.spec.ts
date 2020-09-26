import MockDate from 'mockdate';
import {
  mockFakeTransaction,
  mockFakeTransactionRequest,
} from '@/modules/payment/models/mocks/mock-transaction';
import { AddTransactionRepository } from '@/modules/payment/repositories/transaction/protocols/add-transaction-repository';
import { mockAddTransactionRepository } from '@/modules/payment/repositories/mocks/mock-transaction-repository';
import { DbPayOnce } from './db-pay-once';
import { mockAddCardRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
import {
  mockLoadUserByIdRepository,
  mockUpdateUserRepository,
} from '@/modules/user/repositories/mocks/mock-user-repository';
import { AddCardRepository } from '@/modules/payment/repositories/card/protocols/add-card-repository';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
import CryptoJSHelper from '@/bin/helpers/crypto-js';
const mockFakeRequestPagarme = async () => {
  const fakeTransaction = mockFakeTransactionRequest();
  const cardHash = await CryptoJSHelper.generateCardHashPagarme(
    fakeTransaction.card_hash,
  );
  return { cardHash, ...fakeTransaction };
};
type SutTypes = {
  sut: DbPayOnce;
  addTransactionRepositoryStub: AddTransactionRepository;
  addCardRepositoryStub: AddCardRepository;
  updateUserRepositoryStub: UpdateUserRepository;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};

const makeSut = (): SutTypes => {
  const addTransactionRepositoryStub = mockAddTransactionRepository();
  const addCardRepositoryStub = mockAddCardRepository();
  const updateUserRepositoryStub = mockUpdateUserRepository();
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbPayOnce(
    addTransactionRepositoryStub,
    addCardRepositoryStub,
    updateUserRepositoryStub,
    loadUserByIdRepositoryStub,
  );
  return {
    sut,
    addCardRepositoryStub,
    updateUserRepositoryStub,
    loadUserByIdRepositoryStub,
    addTransactionRepositoryStub,
  };
};

describe('DbPayOnce Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should return an transaction on success', async () => {
    const { sut } = makeSut();
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const transaction = await sut.payOnce(fakeTransactionRequest, 'userId');
    expect(transaction).toEqual(mockFakeTransaction());
  });
  test('should return null if addTransactionRepositoryStub returns null', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut();
    addTransactionRepositoryStub.transactionModel = null;
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const transaction = await sut.payOnce(fakeTransactionRequest, 'userId');
    expect(transaction).toBeNull();
  });
  test('should return null if addCardRepositoryStub returns null', async () => {
    const { sut, addCardRepositoryStub } = makeSut();
    addCardRepositoryStub.cardModel = null;
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const transaction = await sut.payOnce(fakeTransactionRequest, 'userId');
    expect(transaction).toBeNull();
  });
  test('should return null if updateUserRepositoryStub returns null', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    updateUserRepositoryStub.userModel = null;
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const transaction = await sut.payOnce(fakeTransactionRequest, 'userId');
    expect(transaction).toBeNull();
  });
  test('should return null if loadUserByIdRepositoryStub returns null', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    loadUserByIdRepositoryStub.userModel = null;
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const transaction = await sut.payOnce(fakeTransactionRequest, 'userId');
    expect(transaction).toBeNull();
  });

  test('Should throw if addTransactionRepositoryStub throws', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut();
    jest
      .spyOn(addTransactionRepositoryStub, 'add')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const promise = sut.payOnce(fakeTransactionRequest, 'userId');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if addCardRepositoryStub throws', async () => {
    const { sut, addCardRepositoryStub } = makeSut();
    jest.spyOn(addCardRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const promise = sut.payOnce(fakeTransactionRequest, 'userId');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if updateUserRepositoryStub throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    jest
      .spyOn(updateUserRepositoryStub, 'updateOne')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const promise = sut.payOnce(fakeTransactionRequest, 'userId');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if loadUserByIdRepositoryStub throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const fakeTransactionRequest = await mockFakeRequestPagarme();
    const promise = sut.payOnce(fakeTransactionRequest, 'userId');
    await expect(promise).rejects.toThrow();
  });
});

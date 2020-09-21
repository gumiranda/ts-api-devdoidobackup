import MockDate from 'mockdate';
import {
  mockFakeTransactionData,
  mockFakeTransaction,
} from '@/modules/payment/models/mocks/mock-transaction';
import { AddTransactionRepository } from '@/modules/payment/repositories/transaction/protocols/add-transaction-repository';
import { DbAddTransaction } from './db-add-transaction';
import { mockAddTransactionRepository } from '@/modules/payment/repositories/mocks/mock-transaction-repository';

type SutTypes = {
  sut: DbAddTransaction;
  addTransactionRepositoryStub: AddTransactionRepository;
};

const makeSut = (): SutTypes => {
  const addTransactionRepositoryStub = mockAddTransactionRepository();
  const sut = new DbAddTransaction(addTransactionRepositoryStub);
  return {
    sut,
    addTransactionRepositoryStub,
  };
};

describe('DbAddTransaction Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call AddTransactionRepository with correct values', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addTransactionRepositoryStub, 'add');
    await sut.add(mockFakeTransactionData());
    expect(addSpy).toHaveBeenCalledWith(mockFakeTransactionData());
  });

  test('Should return an transaction on success', async () => {
    const { sut } = makeSut();
    const transaction = await sut.add(mockFakeTransactionData());
    expect(transaction).toEqual(mockFakeTransaction());
  });
});

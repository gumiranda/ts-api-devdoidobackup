import MockDate from 'mockdate';
import { mockFakeTransaction } from '@/modules/payment/models/mocks/mock-transaction';
import { AddTransactionRepository } from '@/modules/payment/repositories/transaction/protocols/add-transaction-repository';
import { mockAddTransactionRepository } from '@/modules/payment/repositories/mocks/mock-transaction-repository';
import { mockLoadCardByIdRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
import { mockUpdatePayDay } from '../../mocks/mock-transaction';
import { UpdatePayDay } from '../../update-pay-day/update-pay-day';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';
import { DbPayAgain } from './db-pay-again';

type SutTypes = {
  sut: DbPayAgain;
  addTransactionRepositoryStub: AddTransactionRepository;
  loadCardByIdRepositoryStub: LoadCardByIdRepository;
  UpdatePayDayStub: UpdatePayDay;
};

const makeSut = (): SutTypes => {
  const addTransactionRepositoryStub = mockAddTransactionRepository();
  const loadCardByIdRepositoryStub = mockLoadCardByIdRepository();
  const UpdatePayDayStub = mockUpdatePayDay();
  const sut = new DbPayAgain(
    addTransactionRepositoryStub,
    loadCardByIdRepositoryStub,
    UpdatePayDayStub,
  );
  return {
    sut,
    loadCardByIdRepositoryStub,
    UpdatePayDayStub,
    addTransactionRepositoryStub,
  };
};

describe('DbPayAgain Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should return an transaction on success', async () => {
    const { sut } = makeSut();
    const transaction = await sut.payAgain(
      process.env.CARDIDPAGARME,
      30,
      'userId',
    );
    expect(transaction).toEqual(mockFakeTransaction());
  });
  test('should return null if addTransactionRepositoryStub returns null', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut();
    addTransactionRepositoryStub.transactionModel = null;

    const transaction = await sut.payAgain(
      process.env.CARDIDPAGARME,
      30,
      'userId',
    );
    expect(transaction).toBeNull();
  });
  test('should return null if loadCardByIdRepositoryStub returns null', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    loadCardByIdRepositoryStub.cardModel = null;

    const transaction = await sut.payAgain(
      process.env.CARDIDPAGARME,
      30,
      'userId',
    );
    expect(transaction).toBeNull();
  });
  test('should return null if UpdatePayDayStub returns null', async () => {
    const { sut, UpdatePayDayStub } = makeSut();
    UpdatePayDayStub.userModel = null;

    const transaction = await sut.payAgain(
      process.env.CARDIDPAGARME,
      30,
      'userId',
    );
    expect(transaction).toBeNull();
  });

  test('Should throw if addTransactionRepositoryStub throws', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut();
    jest
      .spyOn(addTransactionRepositoryStub, 'add')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = sut.payAgain(process.env.CARDIDPAGARME, 30, 'userId');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if loadCardByIdRepositoryStub throws', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadCardByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = sut.payAgain(process.env.CARDIDPAGARME, 30, 'userId');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if UpdatePayDayStub throws', async () => {
    const { sut, UpdatePayDayStub } = makeSut();
    jest.spyOn(UpdatePayDayStub, 'updatePayDay').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.payAgain(process.env.CARDIDPAGARME, 30, 'userId');
    await expect(promise).rejects.toThrow();
  });
});

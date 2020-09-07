import MockDate from 'mockdate';
import { DbUpdateAccount } from './db-update-account';
import { UpdateAccountRepository } from '@/modules/account/repositories/protocols/update-account-repository';
import { mockFakeUpdateAccountData } from '@/modules/account/models/mocks/mock-account';
import { mockUpdateAccountRepository } from '@/modules/account/repositories/mocks/mock-account-repository';

type SutTypes = {
  sut: DbUpdateAccount;
  updateAccountRepositoryStub: UpdateAccountRepository;
};

const makeSut = (): SutTypes => {
  const updateAccountRepositoryStub = mockUpdateAccountRepository();
  const sut = new DbUpdateAccount(updateAccountRepositoryStub);
  return {
    sut,
    updateAccountRepositoryStub,
  };
};

describe('DbUpdateAccount Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'updateOne');
    await sut.updateAccount(mockFakeUpdateAccountData(), 'any_account_id');
    expect(updateSpy).toHaveBeenCalledWith(
      mockFakeUpdateAccountData(),
      'any_account_id',
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccountRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateAccount(
      mockFakeUpdateAccountData(),
      'any_account_id',
    );
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeUpdateAccountData();
    const account = await sut.updateAccount(fakeUpdateObject, 'any_account_id');
    expect(account.cpf).toEqual(fakeUpdateObject.cpf);
    expect(account.phone).toEqual(fakeUpdateObject.phone);
  });
});

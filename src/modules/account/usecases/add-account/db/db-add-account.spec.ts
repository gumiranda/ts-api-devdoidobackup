import { DbAddAccount } from '@/modules/account/usecases/add-account/db/db-add-account';
import { Encrypter } from '@/bin/protocols/crypto/encrypter';
import { AddAccountRepository } from '@/modules/account/repositories/protocols/add-account-repository';
import { LoadAccountByEmailRepository } from '@/modules/account/repositories/protocols/load-account-by-email-repository';
import { mockEncrypter } from '@/bin/test/mock-crypto';
import {
  mockLoadAccountByEmailRepository,
  mockAddAccountRepository,
} from '@/modules/account/repositories/mocks/mock-account-repository';
import {
  mockFakeAccountData,
  mockFakeAccount,
  mockFakeAccountWithPasswordHashed,
} from '@/modules/account/models/mocks/mock-account';
import MockDate from 'mockdate';
import { addDay } from '@/bin/utils/date-fns';

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const encrypterStub = mockEncrypter();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );
  return {
    sut,
    encrypterStub,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const addAccount = mockFakeAccountData();
    await sut.add(addAccount);
    expect(encryptSpy).toHaveBeenCalledWith(addAccount.password);
    expect(encrypterStub.plaintext).toBe(addAccount.password);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(mockFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, encrypterStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith(
      mockFakeAccountWithPasswordHashed(encrypterStub.hashedPassword),
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(mockFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockFakeAccountData());
    expect(account).toEqual(mockFakeAccount());
  });
  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(mockFakeAccount())),
      );
    const account = await sut.add(mockFakeAccountData());
    expect(account).toBeNull();
  });
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockFakeAccountData());
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });
});

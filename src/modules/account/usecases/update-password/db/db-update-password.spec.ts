import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';
import { LoadAccountByIdRepository } from '@/modules/account/repositories/protocols/load-account-by-id-repository';
import { mockHashComparer } from '@/bin/test/mock-crypto';
import { DbUpdatePassword } from './db-update-password';
import {
  mockUpdatePasswordRepository,
  mockLoadAccountByIdRepository,
} from '@/modules/account/repositories/mocks/mock-account-repository';

type SutTypes = {
  sut: DbUpdatePassword;
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository;
  hashComparerStub: HashComparer;
};

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository();
  const updatePasswordRepositoryStub = mockUpdatePasswordRepository();
  const hashComparerStub = mockHashComparer();
  const sut = new DbUpdatePassword(
    updatePasswordRepositoryStub,
    loadAccountByIdRepositoryStub,
    hashComparerStub,
  );
  return {
    sut,
    hashComparerStub,
    loadAccountByIdRepositoryStub,
  };
};

describe('UpdatePassword UseCase', () => {
  test('Should call LoadAccountIdRepository with correct email', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById');
    await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    expect(loadSpy).toHaveBeenCalledWith('any_account_id');
  });
  test('Should throw if LoadAccountIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadAccountIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(null);
    const accountUpdated = await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    expect(accountUpdated).toBeNull();
  });

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'valid_password');
  });
  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accountUpdated = await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_account_id',
    );
    expect(accountUpdated).toBeNull();
  });
});

import { HashComparer } from '@/bin/protocols/cryptography/hash-comparer';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
import { mockHashComparer } from '@/bin/test/mock-crypto';
import { DbUpdatePassword } from './db-update-password';
import {
  mockUpdatePasswordRepository,
  mockLoadUserByIdRepository,
} from '@/modules/user/repositories/mocks/mock-user-repository';

type SutTypes = {
  sut: DbUpdatePassword;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
  hashComparerStub: HashComparer;
};

const makeSut = (): SutTypes => {
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const updatePasswordRepositoryStub = mockUpdatePasswordRepository();
  const hashComparerStub = mockHashComparer();
  const sut = new DbUpdatePassword(
    updatePasswordRepositoryStub,
    loadUserByIdRepositoryStub,
    hashComparerStub,
  );
  return {
    sut,
    hashComparerStub,
    loadUserByIdRepositoryStub,
  };
};

describe('UpdatePassword UseCase', () => {
  test('Should call LoadUserIdRepository with correct email', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById');
    await sut.updatePassword('new_password', 'valid_password', 'any_user_id');
    expect(loadSpy).toHaveBeenCalledWith('any_user_id');
  });
  test('Should throw if LoadUserIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updatePassword(
      'new_password',
      'valid_password',
      'any_user_id',
    );
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadUserIdRepository returns null', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(null);
    const userUpdated = await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_user_id',
    );
    expect(userUpdated).toBeNull();
  });

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.updatePassword('new_password', 'valid_password', 'any_user_id');
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
      'any_user_id',
    );
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const userUpdated = await sut.updatePassword(
      'new_password',
      'valid_password',
      'any_user_id',
    );
    expect(userUpdated).toBeNull();
  });
});

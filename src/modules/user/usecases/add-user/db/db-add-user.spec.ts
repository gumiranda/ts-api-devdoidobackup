import { DbAddUser } from '@/modules/user/usecases/add-user/db/db-add-user';
import { Encrypter } from '@/bin/protocols/cryptography/encrypter';
import { AddUserRepository } from '@/modules/user/repositories/protocols/add-user-repository';
import { LoadUserByEmailRepository } from '@/modules/user/repositories/protocols/load-user-by-email-repository';
import { mockEncrypter } from '@/bin/test/mock-crypto';
import {
  mockLoadUserByEmailRepository,
  mockAddUserRepository,
} from '@/modules/user/repositories/mocks/mock-user-repository';
import {
  mockFakeUserData,
  mockFakeUser,
  mockFakeUserWithPasswordHashed,
} from '@/modules/user/models/mocks/mock-user';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbAddUser;
  encrypterStub: Encrypter;
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository;
  addUserRepositoryStub: AddUserRepository;
};

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository();
  const encrypterStub = mockEncrypter();
  const addUserRepositoryStub = mockAddUserRepository();
  const sut = new DbAddUser(
    encrypterStub,
    addUserRepositoryStub,
    loadUserByEmailRepositoryStub,
  );
  return {
    sut,
    encrypterStub,
    loadUserByEmailRepositoryStub,
    addUserRepositoryStub,
  };
};

describe('DbAddUser Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const addUser = mockFakeUserData('client');
    await sut.add(addUser);
    expect(encryptSpy).toHaveBeenCalledWith(addUser.password);
    expect(encrypterStub.plaintext).toBe(addUser.password);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(mockFakeUserData('client'));
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub, encrypterStub } = makeSut();
    const addSpy = jest.spyOn(addUserRepositoryStub, 'add');
    await sut.add(mockFakeUserData('client'));
    expect(addSpy).toHaveBeenCalledWith(
      mockFakeUserWithPasswordHashed(encrypterStub.hashedText),
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    jest
      .spyOn(addUserRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(mockFakeUserData('client'));
    await expect(promise).rejects.toThrow();
  });

  test('Should return an user on success', async () => {
    const { sut } = makeSut();
    const user = await sut.add(mockFakeUserData('client'));
    expect(user).toEqual(mockFakeUser('client'));
  });
  test('Should return null if LoadUserByEmailRepository not return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(mockFakeUser('client'))),
      );
    const user = await sut.add(mockFakeUserData('client'));
    expect(user).toBeNull();
  });
  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockFakeUserData('client'));
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });
});

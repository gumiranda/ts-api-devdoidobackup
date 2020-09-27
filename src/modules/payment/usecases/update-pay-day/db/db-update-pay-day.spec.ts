import MockDate from 'mockdate';

import {
  mockLoadUserByIdRepository,
  mockUpdateUserOwnerRepository,
} from '@/modules/user/repositories/mocks/mock-user-repository';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
import { DbUpdatePayDay } from './db-update-pay-day';
import { mockFakeUserUpdated } from '../../../../user/models/mocks/mock-user';

type SutTypes = {
  sut: DbUpdatePayDay;
  updateUserRepositoryStub: UpdateUserRepository;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};

const makeSut = (): SutTypes => {
  const updateUserRepositoryStub = mockUpdateUserOwnerRepository();
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbUpdatePayDay(
    updateUserRepositoryStub,
    loadUserByIdRepositoryStub,
  );
  return {
    sut,
    updateUserRepositoryStub,
    loadUserByIdRepositoryStub,
  };
};

describe('DbUpdatePayDay Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should return an userUpdated on success', async () => {
    const { sut } = makeSut();
    const userUpdated = await sut.updatePayDay('userId', 30);
    expect(userUpdated).toEqual(mockFakeUserUpdated('owner'));
  });

  test('should return null if updateUserRepositoryStub returns null', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    updateUserRepositoryStub.userModel = null;
    const userUpdated = await sut.updatePayDay('userId', 30);
    expect(userUpdated).toBeNull();
  });
  test('should return null if loadUserByIdRepositoryStub returns null', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    loadUserByIdRepositoryStub.userModel = null;
    const userUpdated = await sut.updatePayDay('userId', 30);
    expect(userUpdated).toBeNull();
  });

  test('Should throw if updateUserRepositoryStub throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    jest
      .spyOn(updateUserRepositoryStub, 'updateOne')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.updatePayDay('userId', 30);
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if loadUserByIdRepositoryStub throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.updatePayDay('userId', 30);
    await expect(promise).rejects.toThrow();
  });
});

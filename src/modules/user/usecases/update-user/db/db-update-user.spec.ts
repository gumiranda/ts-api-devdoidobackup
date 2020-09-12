import MockDate from 'mockdate';
import { DbUpdateUser } from './db-update-user';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { mockFakeUpdateUserData } from '@/modules/user/models/mocks/mock-user';
import { mockUpdateUserRepository } from '@/modules/user/repositories/mocks/mock-user-repository';

type SutTypes = {
  sut: DbUpdateUser;
  updateUserRepositoryStub: UpdateUserRepository;
};

const makeSut = (): SutTypes => {
  const updateUserRepositoryStub = mockUpdateUserRepository();
  const sut = new DbUpdateUser(updateUserRepositoryStub);
  return {
    sut,
    updateUserRepositoryStub,
  };
};

describe('DbUpdateUser Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'updateOne');
    await sut.updateUser(mockFakeUpdateUserData(), 'any_user_id');
    expect(updateSpy).toHaveBeenCalledWith(
      mockFakeUpdateUserData(),
      'any_user_id',
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    jest
      .spyOn(updateUserRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateUser(mockFakeUpdateUserData(), 'any_user_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return an user on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeUpdateUserData();
    const user = await sut.updateUser(fakeUpdateObject, 'any_user_id');
    expect(user.cpf).toEqual(fakeUpdateObject.cpf);
    expect(user.phone).toEqual(fakeUpdateObject.phone);
  });
});

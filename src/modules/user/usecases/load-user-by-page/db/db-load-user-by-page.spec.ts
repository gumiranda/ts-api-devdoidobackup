import MockDate from 'mockdate';
import { DbLoadUserByPage } from '@/modules/user/usecases/load-user-by-page/db/db-load-user-by-page';
import { LoadUserByPageRepository } from '@/modules/user/repositories/protocols/load-user-by-page-repository';
import {
  makeFakeArrayUsers,
  mockFakeUsersPaginated,
} from '@/modules/user/models/mocks/mock-user';
import { mockLoadUserByPageRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
type SutTypes = {
  sut: DbLoadUserByPage;
  loadUserStub: LoadUserByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadUserStub = mockLoadUserByPageRepository();
  const sut = new DbLoadUserByPage(loadUserStub);
  return {
    sut,
    loadUserStub,
  };
};
describe('DbLoadUserByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadUserByPageRepository with correct values', async () => {
    const { sut, loadUserStub } = makeSut();
    const loadUserSpy = jest.spyOn(loadUserStub, 'loadByPage');
    await sut.loadByPage(1, 'user_id');
    expect(loadUserSpy).toHaveBeenCalledWith(1, 'user_id');
  });
  test('should call countUsersByPage with correct values', async () => {
    const { sut, loadUserStub } = makeSut();
    const countUsersByPageSpy = jest.spyOn(loadUserStub, 'countUsersByPage');
    await sut.loadByPage(1, 'user_id');
    expect(countUsersByPageSpy).toHaveBeenCalledWith(1, 'user_id');
  });
  test('should return users on success', async () => {
    const { sut } = makeSut();
    const users = await sut.loadByPage(1, 'user_id');
    expect(users).toEqual(mockFakeUsersPaginated());
  });
  test('should throw if LoadUserByPageRepository throws', async () => {
    const { sut, loadUserStub } = makeSut();
    jest
      .spyOn(loadUserStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'user_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadUserByPageRepository throws', async () => {
    const { sut, loadUserStub } = makeSut();
    jest
      .spyOn(loadUserStub, 'countUsersByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'user_id');
    await expect(promise).rejects.toThrow();
  });
});

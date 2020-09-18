import { DbLoadUserById } from './db-load-user-by-id';
import faker from 'faker-br';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
import { mockLoadUserByIdRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
type SutTypes = {
  sut: DbLoadUserById;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};
let _id: string;
const makeSut = (): SutTypes => {
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbLoadUserById(loadUserByIdRepositoryStub);
  return {
    sut,
    loadUserByIdRepositoryStub,
  };
};
describe('DbLoadUserById tests', () => {
  beforeEach(() => {
    _id = faker.random.uuid();
  });

  test('should call LoadUserByIdRepository with correct values', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    await sut.loadById(_id);
    expect(loadUserByIdRepositoryStub._id).toBe(_id);
  });
  test('should return null if LoadUserByIdRepository returns null', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    loadUserByIdRepositoryStub.userModel = null;
    const user = await sut.loadById(_id);
    expect(user).toBeNull();
  });
  test('should return user if LoadUserByIdRepository returns an user', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    const user = await sut.loadById(_id);
    expect(user).toEqual(loadUserByIdRepositoryStub.userModel);
  });

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(_id);
    await expect(promise).rejects.toThrow();
  });
});

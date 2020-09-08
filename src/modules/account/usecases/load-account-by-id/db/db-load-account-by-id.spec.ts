import { DbLoadAccountById } from './db-load-account-by-id';
import faker from 'faker';
import { LoadAccountByIdRepository } from '@/modules/account/repositories/protocols/load-account-by-id-repository';
import { mockLoadAccountByIdRepository } from '@/modules/account/repositories/mocks/mock-account-repository';
type SutTypes = {
  sut: DbLoadAccountById;
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository;
};
let _id: string;
const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository();
  const sut = new DbLoadAccountById(loadAccountByIdRepositoryStub);
  return {
    sut,
    loadAccountByIdRepositoryStub,
  };
};
describe('DbLoadAccountById tests', () => {
  beforeEach(() => {
    _id = faker.random.uuid();
  });

  test('should call LoadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    await sut.loadById(_id);
    expect(loadAccountByIdRepositoryStub._id).toBe(_id);
  });
  test('should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    loadAccountByIdRepositoryStub.accountModel = null;
    const account = await sut.loadById(_id);
    expect(account).toBeNull();
  });
  test('should return account if LoadAccountByIdRepository returns an account', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    const account = await sut.loadById(_id);
    expect(account).toEqual(loadAccountByIdRepositoryStub.accountModel);
  });

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(_id);
    await expect(promise).rejects.toThrow();
  });
});

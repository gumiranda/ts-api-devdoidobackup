import MockDate from 'mockdate';
import { DbLoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/db/db-load-account-by-page';
import { LoadAccountByPageRepository } from '@/modules/account/repositories/protocols/load-account-by-page-repository';
import {
  makeFakeArrayAccounts,
  mockFakeAccountsPaginated,
} from '@/modules/account/models/mocks/mock-account';
import { mockLoadAccountByPageRepository } from '@/modules/account/repositories/mocks/mock-account-repository';
type SutTypes = {
  sut: DbLoadAccountByPage;
  loadAccountStub: LoadAccountByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadAccountStub = mockLoadAccountByPageRepository();
  const sut = new DbLoadAccountByPage(loadAccountStub);
  return {
    sut,
    loadAccountStub,
  };
};
describe('DbLoadAccountByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadAccountByPageRepository with correct values', async () => {
    const { sut, loadAccountStub } = makeSut();
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'loadByPage');
    await sut.loadByPage(1, 'account_id');
    expect(loadAccountSpy).toHaveBeenCalledWith(1, 'account_id');
  });
  test('should call countAccountsByPage with correct values', async () => {
    const { sut, loadAccountStub } = makeSut();
    const countAccountsByPageSpy = jest.spyOn(
      loadAccountStub,
      'countAccountsByPage',
    );
    await sut.loadByPage(1, 'account_id');
    expect(countAccountsByPageSpy).toHaveBeenCalledWith(1, 'account_id');
  });
  test('should return accounts on success', async () => {
    const { sut } = makeSut();
    const accounts = await sut.loadByPage(1, 'account_id');
    expect(accounts).toEqual(mockFakeAccountsPaginated());
  });
  test('should throw if LoadAccountByPageRepository throws', async () => {
    const { sut, loadAccountStub } = makeSut();
    jest
      .spyOn(loadAccountStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'account_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadAccountByPageRepository throws', async () => {
    const { sut, loadAccountStub } = makeSut();
    jest
      .spyOn(loadAccountStub, 'countAccountsByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'account_id');
    await expect(promise).rejects.toThrow();
  });
});

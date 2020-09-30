import { DbLoadRequestByPage } from './db-load-request-by-page';
import MockDate from 'mockdate';
import { mockFakeRequestsPaginated } from '@/modules/request/models/mocks/mock-request';
import { mockLoadRequestByPageRepository } from '@/modules/request/repositories/mocks/mock-request-repository';
import { LoadRequestByPageRepository } from '@/modules/request/repositories/protocols/load-request-by-page-repository';
type SutTypes = {
  sut: DbLoadRequestByPage;
  loadRequestStub: LoadRequestByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadRequestStub = mockLoadRequestByPageRepository();
  const sut = new DbLoadRequestByPage(loadRequestStub);
  return {
    sut,
    loadRequestStub,
  };
};
describe('DbLoadRequestByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadRequestByPageRepository with correct values', async () => {
    const { sut, loadRequestStub } = makeSut();
    const loadRequestSpy = jest.spyOn(loadRequestStub, 'loadByPage');
    await sut.loadByPage(1, 'request_id');
    expect(loadRequestSpy).toHaveBeenCalledWith(1, 'request_id');
  });
  test('should call countRequestsByPage with correct values', async () => {
    const { sut, loadRequestStub } = makeSut();
    const countRequestsByPageSpy = jest.spyOn(
      loadRequestStub,
      'countRequestsByPage',
    );
    await sut.loadByPage(1, 'request_id');
    expect(countRequestsByPageSpy).toHaveBeenCalledWith('request_id');
  });
  test('should return requests on success', async () => {
    const { sut } = makeSut();
    const requests = await sut.loadByPage(1, 'request_id');
    expect(requests).toEqual(mockFakeRequestsPaginated());
  });
  test('should throw if LoadRequestByPageRepository throws', async () => {
    const { sut, loadRequestStub } = makeSut();
    jest
      .spyOn(loadRequestStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'request_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadRequestByPageRepository throws', async () => {
    const { sut, loadRequestStub } = makeSut();
    jest
      .spyOn(loadRequestStub, 'countRequestsByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'request_id');
    await expect(promise).rejects.toThrow();
  });
});

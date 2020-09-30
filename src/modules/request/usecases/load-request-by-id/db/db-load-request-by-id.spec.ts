import { DbLoadRequestById } from './db-load-request-by-id';
import faker from 'faker-br';
import { LoadRequestByIdRepository } from '@/modules/request/repositories/protocols/load-request-by-id-repository';
import { mockLoadRequestByIdRepository } from '@/modules/request/repositories/mocks/mock-request-repository';
type SutTypes = {
  sut: DbLoadRequestById;
  loadRequestByIdRepositoryStub: LoadRequestByIdRepository;
};
let request_id: string;
const makeSut = (): SutTypes => {
  const loadRequestByIdRepositoryStub = mockLoadRequestByIdRepository();
  const sut = new DbLoadRequestById(loadRequestByIdRepositoryStub);
  return {
    sut,
    loadRequestByIdRepositoryStub,
  };
};
describe('DbLoadRequestById tests', () => {
  beforeEach(() => {
    request_id = faker.random.uuid();
  });

  test('should call LoadRequestByIdRepository with correct values', async () => {
    const { sut, loadRequestByIdRepositoryStub } = makeSut();
    await sut.loadById(request_id);
    expect(loadRequestByIdRepositoryStub.request_id).toBe(request_id);
  });
  test('should return null if LoadRequestByIdRepository returns null', async () => {
    const { sut, loadRequestByIdRepositoryStub } = makeSut();
    loadRequestByIdRepositoryStub.requestModel = null;
    const request = await sut.loadById(request_id);
    expect(request).toBeNull();
  });
  test('should return request if LoadRequestByIdRepository returns an request', async () => {
    const { sut, loadRequestByIdRepositoryStub } = makeSut();
    const request = await sut.loadById(request_id);
    expect(request).toEqual(loadRequestByIdRepositoryStub.requestModel);
  });

  test('Should throw if LoadRequestByIdRepository throws', async () => {
    const { sut, loadRequestByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadRequestByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(request_id);
    await expect(promise).rejects.toThrow();
  });
});

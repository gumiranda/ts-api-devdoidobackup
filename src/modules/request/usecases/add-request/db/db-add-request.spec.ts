import { DbAddRequest } from './db-add-request';
import MockDate from 'mockdate';
import { mockFakeRequest } from '@/modules/request/models/mocks/mock-request';
import { mockAddRequestRepository } from '@/modules/request/repositories/mocks/mock-request-repository';
import { AddRequestRepository } from '@/modules/request/repositories/protocols/add-request-repository';
import { mockLoadUserByIdRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

type SutTypes = {
  sut: DbAddRequest;
  addRequestStub: AddRequestRepository;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};

const makeSut = (): SutTypes => {
  const addRequestStub = mockAddRequestRepository();
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbAddRequest(addRequestStub, loadUserByIdRepositoryStub);
  return {
    sut,
    addRequestStub,
    loadUserByIdRepositoryStub,
  };
};
describe('DbAddRequest', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddRequestRepository with correct values', async () => {
    const { sut, addRequestStub } = makeSut();
    const requestData = mockFakeRequest();
    const addRequestSpy = jest.spyOn(addRequestStub, 'add');
    await sut.add(requestData);
    expect(addRequestSpy).toHaveBeenCalledWith(requestData);
  });
  test('should throw if AddRequestRepository throws', async () => {
    const { sut, addRequestStub } = makeSut();
    const requestData = mockFakeRequest();
    jest
      .spyOn(addRequestStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(requestData);
    await expect(promise).rejects.toThrow();
  });

  test('should throw if loadUserByIdRepositoryStub throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    const requestData = mockFakeRequest();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(requestData);
    await expect(promise).rejects.toThrow();
  });
});

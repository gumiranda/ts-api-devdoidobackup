import { mockUpdateRequestRepository } from '@/modules/request/repositories/mocks/mock-request-repository';
import { UpdateRequestRepository } from '@/modules/request/repositories/protocols/update-request-repository';
import MockDate from 'mockdate';
import { DbUpdateRequest } from './db-update-request';
import { mockFakeRequest } from '../../../models/mocks/mock-request';

type SutTypes = {
  sut: DbUpdateRequest;
  updateRequestRepositoryStub: UpdateRequestRepository;
};

const makeSut = (): SutTypes => {
  const updateRequestRepositoryStub = mockUpdateRequestRepository();
  const sut = new DbUpdateRequest(updateRequestRepositoryStub);
  return {
    sut,
    updateRequestRepositoryStub,
  };
};

describe('DbUpdateRequest Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call UpdateRequestRepository with correct values', async () => {
    const { sut, updateRequestRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateRequestRepositoryStub, 'updateOne');
    await sut.updateRequest(mockFakeRequest(), 'any_request_id');
    expect(updateSpy).toHaveBeenCalledWith(mockFakeRequest(), 'any_request_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, updateRequestRepositoryStub } = makeSut();
    jest
      .spyOn(updateRequestRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateRequest(mockFakeRequest(), 'any_request_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return an request on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeRequest();
    const request = await sut.updateRequest(fakeUpdateObject, 'any_request_id');
    expect(request.read).toEqual(fakeUpdateObject.read);
    expect(request.content).toEqual(fakeUpdateObject.content);
  });
});

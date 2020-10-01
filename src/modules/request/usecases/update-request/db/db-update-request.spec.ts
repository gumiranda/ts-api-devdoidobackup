import { mockUpdateRequestRepository } from '@/modules/request/repositories/mocks/mock-request-repository';
import { UpdateRequestRepository } from '@/modules/request/repositories/protocols/update-request-repository';
import MockDate from 'mockdate';
import { DbUpdateRequest } from './db-update-request';
import { mockFakeRequest } from '../../../models/mocks/mock-request';
import { mockUpdateProfessionalUserRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { ObjectId } from 'mongodb';

type SutTypes = {
  sut: DbUpdateRequest;
  updateRequestRepositoryStub: UpdateRequestRepository;
  updateUserRepositoryStub: UpdateUserRepository;
};

const makeSut = (): SutTypes => {
  const updateRequestRepositoryStub = mockUpdateRequestRepository();
  const updateUserRepositoryStub = mockUpdateProfessionalUserRepository();
  const sut = new DbUpdateRequest(
    updateRequestRepositoryStub,
    updateUserRepositoryStub,
  );
  return {
    sut,
    updateRequestRepositoryStub,
    updateUserRepositoryStub,
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
    await sut.updateRequest(mockFakeRequest(), '5f36bcc7b104350034fec070');
    expect(updateSpy).toHaveBeenCalledWith(
      mockFakeRequest(),
      '5f36bcc7b104350034fec070',
    );
  });

  test('Should throw if updateRequestRepository throws', async () => {
    const { sut, updateRequestRepositoryStub } = makeSut();
    jest
      .spyOn(updateRequestRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateRequest(
      mockFakeRequest(),
      '5f36bcc7b104350034fec070',
    );
    await expect(promise).rejects.toThrow();
  });
  test('Should call updateUserRepositoryStub with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'updateOne');
    await sut.updateRequest(mockFakeRequest(), '5f36bcc7b104350034fec070');
    expect(updateSpy).toHaveBeenCalledWith(
      { ownerId: new ObjectId('5f36bcc7b104350034fec070') },
      '5f36bcc7b104350034fec070',
    );
  });

  test('Should throw if updateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    jest
      .spyOn(updateUserRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateRequest(
      mockFakeRequest(),
      '5f36bcc7b104350034fec070',
    );
    await expect(promise).rejects.toThrow();
  });

  test('Should return an request on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeRequest();
    const request = await sut.updateRequest(
      fakeUpdateObject,
      '5f36bcc7b104350034fec070',
    );
    expect(request.read).toEqual(fakeUpdateObject.read);
    expect(request.content).toEqual(fakeUpdateObject.content);
  });
});

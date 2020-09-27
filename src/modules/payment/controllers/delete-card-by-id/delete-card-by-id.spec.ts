import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { mockFakeCard } from '../../models/mocks/mock-card';
import { DeleteCardById } from '../../usecases/delete-card-by-id/delete-card-by-id';
import { DeleteCardByIdController } from './delete-card-by-id';
import { mockDeleteCardById } from '../../usecases/mocks/mock-card';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    cardId: 'any_card_id',
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: DeleteCardByIdController;
  deleteCardByIdStub: DeleteCardById;
};

const makeSut = (): SutTypes => {
  const deleteCardByIdStub = mockDeleteCardById();
  const sut = new DeleteCardByIdController(deleteCardByIdStub);
  return { sut, deleteCardByIdStub };
};

describe('DeleteCardById Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call deleteById with correct values', async () => {
    const { sut, deleteCardByIdStub } = makeSut();
    const loadSpy = jest.spyOn(deleteCardByIdStub, 'deleteById');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_card_id', 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, deleteCardByIdStub } = makeSut();
    const loadSpy = jest.spyOn(deleteCardByIdStub, 'deleteById');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_card_id', 'any_user_id');
  });
  test('should return 403 if DeleteCardById returns null', async () => {
    const { sut, deleteCardByIdStub } = makeSut();
    jest
      .spyOn(deleteCardByIdStub, 'deleteById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('cardId')));
  });
  test('should return 500 if DeleteCardById throws', async () => {
    const { sut, deleteCardByIdStub } = makeSut();
    jest.spyOn(deleteCardByIdStub, 'deleteById').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if DeleteCardById throws', async () => {
    const { sut, deleteCardByIdStub } = makeSut();
    jest.spyOn(deleteCardByIdStub, 'deleteById').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeCard()));
  });
});

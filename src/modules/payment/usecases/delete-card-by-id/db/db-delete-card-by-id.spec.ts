import { DeleteCardByIdRepository } from '@/modules/payment/repositories/card/protocols/delete-card-by-id-repository';
import { mockDeleteCardByIdRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
import faker from 'faker-br';
import { DbDeleteCardById } from './db-delete-card-by-id';
type SutTypes = {
  sut: DbDeleteCardById;
  deleteByIdRepositoryStub: DeleteCardByIdRepository;
};
let _id: string;
const makeSut = (): SutTypes => {
  const deleteByIdRepositoryStub = mockDeleteCardByIdRepository();
  const sut = new DbDeleteCardById(deleteByIdRepositoryStub);
  return {
    sut,
    deleteByIdRepositoryStub,
  };
};
describe('DbDeleteCardById tests', () => {
  beforeEach(() => {
    _id = faker.random.uuid();
  });

  test('should call DeleteCardByIdRepository with correct values', async () => {
    const { sut, deleteByIdRepositoryStub } = makeSut();
    await sut.deleteById(_id);
    expect(deleteByIdRepositoryStub._id).toBe(_id);
  });
  test('should return null if DeleteCardByIdRepository returns null', async () => {
    const { sut, deleteByIdRepositoryStub } = makeSut();
    deleteByIdRepositoryStub.cardModel = null;
    const card = await sut.deleteById(_id);
    expect(card).toBeNull();
  });
  test('should return card if DeleteCardByIdRepository returns an card', async () => {
    const { sut, deleteByIdRepositoryStub } = makeSut();
    const card = await sut.deleteById(_id);
    expect(card).toEqual(deleteByIdRepositoryStub.cardModel);
  });

  test('Should throw if DeleteCardByIdRepository throws', async () => {
    const { sut, deleteByIdRepositoryStub } = makeSut();
    jest
      .spyOn(deleteByIdRepositoryStub, 'deleteById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.deleteById(_id);
    await expect(promise).rejects.toThrow();
  });
});

import { DbLoadCardById } from './db-load-card-by-id';
import faker from 'faker-br';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';
import { mockLoadCardByIdRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
type SutTypes = {
  sut: DbLoadCardById;
  loadCardByIdRepositoryStub: LoadCardByIdRepository;
};
let card_id: string;
const makeSut = (): SutTypes => {
  const loadCardByIdRepositoryStub = mockLoadCardByIdRepository();
  const sut = new DbLoadCardById(loadCardByIdRepositoryStub);
  return {
    sut,
    loadCardByIdRepositoryStub,
  };
};
describe('DbLoadCardById tests', () => {
  beforeEach(() => {
    card_id = faker.random.uuid();
  });

  test('should call LoadCardByIdRepository with correct values', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    await sut.loadById(card_id);
    expect(loadCardByIdRepositoryStub.card_id).toBe(card_id);
  });
  test('should return null if LoadCardByIdRepository returns null', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    loadCardByIdRepositoryStub.cardModel = null;
    const card = await sut.loadById(card_id);
    expect(card).toBeNull();
  });
  test('should return card if LoadCardByIdRepository returns an card', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    const card = await sut.loadById(card_id);
    expect(card).toEqual(loadCardByIdRepositoryStub.cardModel);
  });

  test('Should throw if LoadCardByIdRepository throws', async () => {
    const { sut, loadCardByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadCardByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(card_id);
    await expect(promise).rejects.toThrow();
  });
});

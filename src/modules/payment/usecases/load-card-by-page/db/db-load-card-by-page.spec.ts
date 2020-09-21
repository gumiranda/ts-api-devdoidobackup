import { mockFakeCardsPaginated } from '@/modules/payment/models/mocks/mock-card';
import { LoadCardByPageRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-page-repository';
import { mockLoadCardByPageRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
import { DbLoadCardByPage } from './db-load-card-by-page';
import MockDate from 'mockdate';
type SutTypes = {
  sut: DbLoadCardByPage;
  loadCardStub: LoadCardByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadCardStub = mockLoadCardByPageRepository();
  const sut = new DbLoadCardByPage(loadCardStub);
  return {
    sut,
    loadCardStub,
  };
};
describe('DbLoadCardByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadCardByPageRepository with correct values', async () => {
    const { sut, loadCardStub } = makeSut();
    const loadCardSpy = jest.spyOn(loadCardStub, 'loadByPage');
    await sut.loadByPage(1, 'card_id');
    expect(loadCardSpy).toHaveBeenCalledWith(1, 'card_id');
  });
  test('should call countCardsByPage with correct values', async () => {
    const { sut, loadCardStub } = makeSut();
    const countCardsByPageSpy = jest.spyOn(loadCardStub, 'countCardsByPage');
    await sut.loadByPage(1, 'card_id');
    expect(countCardsByPageSpy).toHaveBeenCalledWith('card_id');
  });
  test('should return cards on success', async () => {
    const { sut } = makeSut();
    const cards = await sut.loadByPage(1, 'card_id');
    expect(cards).toEqual(mockFakeCardsPaginated());
  });
  test('should throw if LoadCardByPageRepository throws', async () => {
    const { sut, loadCardStub } = makeSut();
    jest
      .spyOn(loadCardStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'card_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadCardByPageRepository throws', async () => {
    const { sut, loadCardStub } = makeSut();
    jest
      .spyOn(loadCardStub, 'countCardsByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'card_id');
    await expect(promise).rejects.toThrow();
  });
});

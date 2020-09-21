import MockDate from 'mockdate';
import {
  mockFakeCardData,
  mockFakeCard,
} from '@/modules/payment/models/mocks/mock-card';
import { AddCardRepository } from '@/modules/payment/repositories/card/protocols/add-card-repository';
import { mockAddCardRepository } from '@/modules/payment/repositories/mocks/mock-card-repository';
import { DbAddCard } from './db-add-card';

type SutTypes = {
  sut: DbAddCard;
  addCardRepositoryStub: AddCardRepository;
};

const makeSut = (): SutTypes => {
  const addCardRepositoryStub = mockAddCardRepository();
  const sut = new DbAddCard(addCardRepositoryStub);
  return {
    sut,
    addCardRepositoryStub,
  };
};

describe('DbAddCard Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call AddCardRepository with correct values', async () => {
    const { sut, addCardRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCardRepositoryStub, 'add');
    await sut.add(mockFakeCardData());
    expect(addSpy).toHaveBeenCalledWith(mockFakeCardData());
  });

  test('Should return an card on success', async () => {
    const { sut } = makeSut();
    const card = await sut.add(mockFakeCardData());
    expect(card).toEqual(mockFakeCard());
  });
});

import { CardMongoRepository } from './card-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { CardModel } from '../../models/card-model';
import {
  makeFakeArrayCards,
  mockFakeCardData,
} from '../../models/mocks/mock-card';
import { mockFakeUserData } from '@/modules/user/models/mocks/mock-user';
import { UserModel } from '@/modules/user/models/user-model';

let cardCollection: Collection;
let userCollection: Collection;

const makeCard = async (): Promise<CardModel> => {
  let card = mockFakeCardData();
  const { ops } = await cardCollection.insertOne(card);
  return ops[0];
};
const makeUser = async (): Promise<UserModel> => {
  let user = mockFakeUserData('client');
  user.coord = { type: 'Point', coordinates: user.coord };
  const { ops } = await userCollection.insertOne(user);
  return ops[0];
};
const makeSut = (): CardMongoRepository => {
  const mongoRepository = new MongoRepository('cards');
  return new CardMongoRepository(mongoRepository);
};
describe('Card Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    cardCollection = await MongoHelper.getCollection('cards');
    userCollection = await MongoHelper.getCollection('users');
    await cardCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  test('Should return an card add success', async () => {
    const sut = makeSut();
    const card = await sut.add(mockFakeCardData());
    expect(card).toBeTruthy();
    expect(card._id).toBeTruthy();
    expect(card.name).toBe('string');
    expect(card.cardNumber).toBe('string');
    expect(card.card_id).toBe('string');
  });

  test('Should return an card loaded by id with success', async () => {
    const card = await makeCard();
    const sut = makeSut();
    const cardLoaded = await sut.loadById(card.card_id);
    expect(cardLoaded).toBeTruthy();
    expect(cardLoaded._id).toBeTruthy();
    expect(cardLoaded.card_id).toEqual(card.card_id);
  });
  test('Should return an card loadByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    let arrayCards = makeFakeArrayCards();
    arrayCards.forEach((acc) => {
      delete acc._id;
      acc.userId = user._id;
    });
    await cardCollection.insertMany(arrayCards);
    const cards = await sut.loadByPage(1, user._id);
    expect(cards).toBeTruthy();
    expect(cards[0]).toBeTruthy();
    expect(cards[1]).toBeTruthy();
    expect(cards.length).toBe(10);
  });
  test('Should return an card countCardsByPage success', async () => {
    const sut = makeSut();
    let arrayCards = makeFakeArrayCards();
    const user = await makeUser();
    arrayCards.forEach((acc) => {
      delete acc._id;
      acc.userId = user._id;
    });
    await cardCollection.insertMany(arrayCards);
    const cardsCounts = await sut.countCardsByPage(user._id);
    expect(cardsCounts).toBe(15);
  });
  test('Should return 0 on countCardsByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    const cardsCounts = await sut.countCardsByPage(user._id);
    expect(cardsCounts).toBe(0);
  });
});

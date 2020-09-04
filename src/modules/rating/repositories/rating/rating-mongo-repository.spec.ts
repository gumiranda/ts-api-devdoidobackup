import { RatingMongoRepository } from './rating-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import {
  makeFakeAddRating,
  makeFakeRatings,
} from '../../models/mocks/mock-rating';
let ratingCollection: Collection;

describe('Rating Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.deleteMany({});
  });

  const makeSut = (): RatingMongoRepository => {
    return new RatingMongoRepository();
  };
  test('Should return an rating add success', async () => {
    const sut = makeSut();
    await sut.add(makeFakeAddRating());
    const rating = await ratingCollection.findOne({
      ratingType: 'atendimento',
    });
    expect(rating).toBeTruthy();
  });
  test('Should return an rating list load success', async () => {
    const sut = makeSut();
    await ratingCollection.insertMany(makeFakeRatings());
    const ratings = await sut.loadAll();
    expect(ratings.length).toBe(2);
    expect(ratings[0].ratingType).toBe('atendimento');
    expect(ratings[1].ratingType).toBe('educação');
  });
  test('Should return an rating by id load success', async () => {
    const sut = makeSut();
    const { ops } = await ratingCollection.insertOne(makeFakeAddRating());
    const { _id } = ops[0];
    const rating = await sut.loadById(_id);
    expect(rating).toBeTruthy();
    expect(rating._id).toEqual(_id);
  });
  test('Should return an empty list load success', async () => {
    const sut = makeSut();
    const ratings = await sut.loadAll();
    expect(ratings.length).toBe(0);
  });
});

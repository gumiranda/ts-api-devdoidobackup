import { RatingMongoRepository } from './rating-mongo-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { RatingModel } from '../models/rating';
let ratingCollection: Collection;
const makeFakeRating = (): RatingModel[] => {
  return [
    {
      ratingFor: 'any_entity',
      _id: 'any_id',
      date: new Date(),
      ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
    },
    {
      ratingFor: 'other_entity',
      _id: 'other_id',
      date: new Date(),
      ratings: [
        { ratingType: 'other_ratingtype', obs: 'other_rating', stars: 3 },
      ],
    },
  ];
};
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
    await sut.add({
      ratingFor: 'any_entity',
      date: new Date(),
      ratings: [
        { ratingType: 'any_type', obs: 'any_email@mail.com', stars: 3 },
        { ratingType: 'any_type', obs: 'any_email@mail.com', stars: 4 },
      ],
    });
    const rating = await ratingCollection.findOne({ ratingFor: 'any_entity' });
    expect(rating).toBeTruthy();
  });
  test('Should return an rating list load success', async () => {
    const sut = makeSut();
    await ratingCollection.insertMany(makeFakeRating());
    const ratings = await sut.loadAll();
    expect(ratings.length).toBe(2);
    expect(ratings[0].ratingFor).toBe('any_entity');
    expect(ratings[1].ratingFor).toBe('other_entity');
  });
  test('Should return an empty list load success', async () => {
    const sut = makeSut();
    const ratings = await sut.loadAll();
    expect(ratings.length).toBe(0);
  });
});

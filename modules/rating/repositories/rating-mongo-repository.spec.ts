import { RatingMongoRepository } from './rating-mongo-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
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
    await sut.add({
      ratingFor: 'any_entity',
      ratings: [
        { ratingType: 'any_type', obs: 'any_email@mail.com', stars: 3 },
        { ratingType: 'any_type', obs: 'any_email@mail.com', stars: 4 },
      ],
    });
    const rating = await ratingCollection.findOne({ ratingFor: 'any_entity' });
    expect(rating).toBeTruthy();
  });
});

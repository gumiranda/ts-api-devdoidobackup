import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { RatingResultMongoRepository } from './rating-result-mongo-repository';
import { RatingModel } from '../../models/rating';
import { AccountModel } from '@/modules/account/models/account-model';
import { makeFakeAddRating } from '@/bin/test/mock-rating';
import { ObjectId } from 'mongodb';
let ratingCollection: Collection;
let ratingResultCollection: Collection;
let accountCollection: Collection;

const makeRating = async (): Promise<RatingModel> => {
  const { ops } = await ratingCollection.insertOne(makeFakeAddRating());
  return ops[0];
};

const makeAccount = async (): Promise<AccountModel> => {
  const { ops } = await accountCollection.insertOne({
    role: 'admin',
    name: 'fausto',
    email: 'fausto@gmail.com',
    password: '1234',
  });
  return ops[0];
};
const makeSut = (): RatingResultMongoRepository => {
  return new RatingResultMongoRepository();
};
describe('RatingResult Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.deleteMany({});
    ratingResultCollection = await MongoHelper.getCollection('ratingResults');
    await ratingResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should add a rating result if its new', async () => {
    const rating = await makeRating();
    const account = await makeAccount();
    const sut = makeSut();
    await sut.save({
      ratingId: rating._id,
      accountId: account._id,
      rating: rating.ratings[0].rating,
      date: new Date(),
    });
    const ratingResult = await ratingResultCollection.findOne({
      ratingId: rating._id,
      accountId: account._id,
    });
    expect(ratingResult).toBeTruthy();
  });

  test('Should update rating result if its not new', async () => {
    const rating = await makeRating();
    const account = await makeAccount();
    await ratingResultCollection.insertOne({
      ratingId: new ObjectId(rating._id),
      accountId: new ObjectId(account._id),
      rating: rating.ratings[0].rating,
      date: new Date(),
    });
    const sut = makeSut();
    await sut.save({
      ratingId: rating._id,
      accountId: account._id,
      rating: rating.ratings[1].rating,
      date: new Date(),
    });
    const ratingResult = await ratingResultCollection
      .find({
        ratingId: rating._id,
        accountId: account._id,
      })
      .toArray();
    expect(ratingResult).toBeTruthy();
    expect(ratingResult.length).toBe(1);
  });
  describe('loadByRatingId()', () => {
    test('Should load rating result', async () => {
      const rating = await makeRating();
      const account = await makeAccount();
      await ratingResultCollection.insertMany([
        {
          ratingId: new ObjectId(rating._id),
          accountId: new ObjectId(account._id),
          rating: rating.ratings[0].rating,
          date: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          accountId: new ObjectId(account._id),
          rating: rating.ratings[0].rating,
          date: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          accountId: new ObjectId(account._id),
          rating: rating.ratings[1].rating,
          date: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          accountId: new ObjectId(account._id),
          rating: rating.ratings[1].rating,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const ratingResult = await sut.loadByRatingId(rating._id);
      expect(ratingResult).toBeTruthy();
      expect(ratingResult.ratingId).toEqual(rating._id);
      expect(ratingResult.ratings[0].count).toBe(2);
      expect(ratingResult.ratings[0].percent).toBe(50);
      expect(ratingResult.ratings[1].count).toBe(2);
      expect(ratingResult.ratings[1].percent).toBe(50);
    });
  });
});

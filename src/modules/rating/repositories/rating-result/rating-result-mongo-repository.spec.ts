import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { RatingResultMongoRepository } from './rating-result-mongo-repository';
import { RatingModel } from '../../models/rating';
import { AccountModel } from '@/modules/account/models/account-model';
import { makeFakeAddRating } from '@/bin/test/mock-rating';

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

  const makeSut = (): RatingResultMongoRepository => {
    return new RatingResultMongoRepository();
  };

  test('Should return an rating save', async () => {
    const rating: any = await makeRating();
    const account: any = await makeAccount();
    const sut = makeSut();
    const ratingResult = await sut.save({
      ratingId: rating._id,
      accountId: account._id,
      rating: rating.ratings[0].rating,
      date: new Date(),
    });
    expect(ratingResult).toBeTruthy();
    expect(ratingResult.ratingId).toEqual(rating._id);
    expect(ratingResult.ratings[0].rating).toBe(rating.ratings[0].rating);
    expect(ratingResult.ratings[0].count).toBe(1);
    expect(ratingResult.ratings[0].percent).toBe(100);
  });
});

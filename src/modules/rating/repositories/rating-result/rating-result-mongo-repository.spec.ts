import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { RatingResultModel } from '../../models/rating-result';
import { RatingResultMongoRepository } from './rating-result-mongo-repository';
import { RatingModel } from '../../models/rating';
import { AccountModel } from '@/modules/account/models/account-model';
import {
  makeFakeAddRatingResult,
  makeFakeAddRating,
} from '@/bin/test/mock-rating';
let ratingCollection: Collection;
let ratingResultCollection: Collection;
let accountCollection: Collection;

const makeRating = async (): Promise<RatingModel> => {
  const { ops } = await ratingCollection.insertOne(makeFakeAddRating());
  return ops[0];
};
const makeRatingResult = async (
  ratingId: string,
  accountId: string,
): Promise<RatingResultModel> => {
  const { ops } = await ratingResultCollection.insertOne({
    ratingId,
    accountId,
    result: 'result',
    date: new Date(),
  });
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
  test('Should update result of rating ', async () => {
    const rating: any = await makeRating();
    const account: any = await makeAccount();
    const sut = makeSut();
    const ratingToSave = await makeFakeAddRatingResult(rating._id, account._id);
    const ratingResult = await sut.save(ratingToSave);
    expect(ratingResult).toBeTruthy();
    expect(ratingResult._id).toBeTruthy();
    expect(ratingResult.result).toBe('result');
  });
  test('Should return an rating save if its not new', async () => {
    const rating: any = await makeRating();
    const account: any = await makeAccount();
    const ratingResultInserted = await makeRatingResult(
      rating._id,
      account._id,
    );
    const sut = makeSut();
    const ratingToSave = await makeFakeAddRatingResult(rating._id, account._id);
    const ratingResult = await sut.save(ratingToSave);
    expect(ratingResult).toBeTruthy();
    expect(ratingResult._id).toEqual(ratingResultInserted._id);
    expect(ratingResult.result).toBe('result');
  });
});

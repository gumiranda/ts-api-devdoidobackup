import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { RatingResultMongoRepository } from './rating-result-mongo-repository';
import { RatingModel } from '@/modules/rating/models/rating';
import { UserModel } from '@/modules/user/models/user-model';
import { ObjectId } from 'mongodb';
import { mockFakeAddRating } from '@/modules/rating/models/mocks/mock-rating';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import faker from 'faker-br';
let ratingCollection: Collection;
let ratingResultCollection: Collection;
let userCollection: Collection;

const makeRating = async (): Promise<RatingModel> => {
  const { ops } = await ratingCollection.insertOne(mockFakeAddRating());
  return ops[0];
};

const makeUser = async (): Promise<UserModel> => {
  const { ops } = await userCollection.insertOne({
    role: 'admin',
    name: faker.random.word(),
    email: faker.internet.email(),
    password: faker.random.word(),
  });
  return ops[0];
};
const makeOwner = async (): Promise<UserModel> => {
  const { ops } = await userCollection.insertOne({
    role: 'owner',
    name: faker.random.word(),
    email: faker.internet.email(),
    password: faker.random.word(),
  });
  return ops[0];
};
const makeSut = (): RatingResultMongoRepository => {
  const mongoRepository = new MongoRepository('ratingResults');
  return new RatingResultMongoRepository(mongoRepository);
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
    userCollection = await MongoHelper.getCollection('users');
    await userCollection.deleteMany({});
  });

  test('Should add a rating result if its new', async () => {
    const rating = await makeRating();
    const user = await makeUser();
    const owner = await makeOwner();
    const sut = makeSut();
    await sut.save({
      ratingId: rating._id,
      ratingFor: owner._id,
      userId: user._id,
      rating: rating.ratings[0].rating,
      comment: 'massa',
      createdAt: new Date(),
    });
    const ratingResult = await ratingResultCollection.findOne({
      ratingId: rating._id,
      userId: user._id,
    });
    expect(ratingResult).toBeTruthy();
  });

  test('Should update rating result if its not new', async () => {
    const rating = await makeRating();
    const user = await makeUser();
    const owner = await makeOwner();
    await ratingResultCollection.insertOne({
      ratingId: new ObjectId(rating._id),
      userId: new ObjectId(user._id),
      comment: 'massa',
      rating: rating.ratings[0].rating,
      createdAt: new Date(),
    });
    const sut = makeSut();
    await sut.save({
      ratingId: rating._id,
      ratingFor: owner._id,
      userId: user._id,
      comment: 'massa',
      rating: rating.ratings[1].rating,
      createdAt: new Date(),
    });
    const ratingResult = await ratingResultCollection
      .find({
        ratingId: rating._id,
        ratingFor: owner._id,
        userId: user._id,
      })
      .toArray();
    expect(ratingResult).toBeTruthy();
    expect(ratingResult.length).toBe(1);
  });
  describe('loadByRatingIdRatingFor()', () => {
    test('Should load rating result', async () => {
      const rating = await makeRating();
      const user = await makeUser();
      const owner = await makeOwner();
      await ratingResultCollection.insertMany([
        {
          ratingId: new ObjectId(rating._id),
          ratingFor: new ObjectId(owner._id),
          userId: new ObjectId(user._id),
          comment: 'massa1',
          rating: rating.ratings[0].rating,
          createdAt: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          userId: new ObjectId(user._id),
          comment: 'massa2',
          ratingFor: new ObjectId(owner._id),
          rating: rating.ratings[0].rating,
          createdAt: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          userId: new ObjectId(user._id),
          comment: 'massa3',
          ratingFor: new ObjectId(owner._id),
          rating: rating.ratings[1].rating,
          createdAt: new Date(),
        },
        {
          ratingId: new ObjectId(rating._id),
          userId: new ObjectId(user._id),
          comment: 'massa4',
          ratingFor: new ObjectId(owner._id),
          rating: rating.ratings[1].rating,
          createdAt: new Date(),
        },
      ]);
      const sut = makeSut();
      const ratingResult = await sut.loadByRatingIdRatingFor(
        rating._id,
        owner._id,
      );
      expect(ratingResult).toBeTruthy();
      expect(ratingResult.ratingId).toEqual(rating._id);
      expect(ratingResult.ratings[0].count).toBe(2);
      expect(ratingResult.ratings[0].percent).toBe(50);
      expect(ratingResult.ratings[1].count).toBe(2);
      expect(ratingResult.ratings[1].percent).toBe(50);
    });
  });
});

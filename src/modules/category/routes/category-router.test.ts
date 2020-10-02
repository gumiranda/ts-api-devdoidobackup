import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection, ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { addDay } from '@/bin/utils/date-fns';
import { makeFakeCategoryRequest } from '../controllers/add-category/add-category.spec';
import { mockFakeAddCategory } from '../models/mocks/mock-category';
let userCollection: Collection;
let categoryCollection: Collection;
const makeAccessToken = async (
  role: string,
  password: string,
): Promise<any> => {
  const res = await userCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    payDay: addDay(new Date(), 30),
    password,
    role,
  });
  const _id = res.ops[0]._id;
  return { _id, token: sign({ _id }, variables.Security.secretKey) };
};

describe('Category routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users');
    categoryCollection = await MongoHelper.getCollection('categories');
    await userCollection.deleteMany({});
    await categoryCollection.deleteMany({});
  });

  describe('POST /category', () => {
    test('Should return 201 an category on success', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      await request(app)
        .post(`/api/category`)
        .send(mockFakeAddCategory())
        .set('authorization', 'Bearer ' + token)
        .expect(201);
    });

    test('Should return 403 without token on category id', async () => {
      await request(app)
        .post('/api/category')
        .send(mockFakeAddCategory())
        .expect(403);
    });
  });
});

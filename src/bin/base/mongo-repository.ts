import { MongoHelper } from '../helpers/db/mongo/mongo-helper';

export class MongoRepository {
  public collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  async add(data) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const result = await collection.insertOne(data);
    return result && result.ops[0];
  }
  async update(id, data) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const rest = await collection.findOneAndUpdate(id, {
      $set: data,
    });
    return rest.value;
  }
  async getOne(query) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.findOne(query);
  }
  async getAll(query) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.find(query).toArray();
  }
  async getPaginate(page, query, sort, limit) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .toArray();
  }
  async getCount(query) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.find(query).count();
  }

  async getMyAll(account) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.find({ accountId: account }).toArray();
  }

  async delete(_id) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const rest = await collection.findOneAndDelete({ _id });
    return rest.value;
  }
  async getById(_id) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.findOne({ _id });
  }
}

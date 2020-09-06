import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';

export class MongoRepository {
  public collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  private async getCollection(): Promise<Collection> {
    return await MongoHelper.getCollection(this.collectionName);
  }
  async add(data) {
    const collection = await this.getCollection();
    const result = await collection.insertOne(data);
    return result && result.ops[0];
  }
  async update(query, data, options) {
    const collection = await this.getCollection();
    return await collection.findOneAndUpdate(query, data, options);
  }
  async getOne(query) {
    const collection = await this.getCollection();
    return await collection.findOne(query);
  }
  async getAll(query) {
    const collection = await this.getCollection();
    return await collection.find(query).toArray();
  }
  async getPaginate(page, query, sort, limit) {
    const collection = await this.getCollection();
    return await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .toArray();
  }
  async getCount(query) {
    const collection = await this.getCollection();
    return await collection.find(query).count();
  }

  async getMyAll(account) {
    const collection = await this.getCollection();
    return await collection.find({ accountId: account }).toArray();
  }

  async delete(_id) {
    const collection = await this.getCollection();
    const rest = await collection.findOneAndDelete({ _id });
    return rest.value;
  }
  async getById(_id) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id });
  }
  async aggregate(query) {
    const collection = await this.getCollection();
    return await collection.aggregate(query).toArray();
  }
}

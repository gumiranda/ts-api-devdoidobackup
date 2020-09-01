import { MongoClient, Collection } from 'mongodb';
import { connect } from 'mongoose';
export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  async connectMongoose(uri: string): Promise<void> {
    this.uri = uri;
    await connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  mapPassword: (collection: any): any => {
    const { password, ...collectionWithoutPassword } = collection;
    return collectionWithoutPassword;
  },
  mapCollectionPassword: (collection: any[]): any[] => {
    return collection.map((c) => MongoHelper.mapPassword(c));
  },
};

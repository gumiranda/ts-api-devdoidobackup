import { AddRatingRepository } from './protocols/add-rating-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddRatingModel } from '../usecases/add-rating/add-rating';
import { LoadRatingRepository } from './protocols/load-rating-repository';
import { RatingModel } from '../models/rating';
import { ObjectId } from 'mongodb';
import { LoadRatingById } from '../usecases/load-rating-by-id/load-rating-by-id';
export class RatingMongoRepository
  implements AddRatingRepository, LoadRatingRepository, LoadRatingById {
  async loadById(_id: string): Promise<RatingModel> {
    const ratingCollection = await MongoHelper.getCollection('ratings');
    const rating: RatingModel = await ratingCollection.findOne({
      _id: new ObjectId(_id),
    });
    return rating;
  }
  async loadAll(): Promise<RatingModel[]> {
    const ratingCollection = await MongoHelper.getCollection('ratings');
    const ratings: RatingModel[] = await ratingCollection.find().toArray();
    return ratings;
  }
  async add(ratingData: AddRatingModel): Promise<void> {
    const ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.insertOne(ratingData);
  }
}

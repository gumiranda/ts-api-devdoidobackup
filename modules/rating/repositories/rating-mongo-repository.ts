import { AddRatingRepository } from './protocols/add-rating-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { AddRatingModel } from '../usecases/add-rating/add-rating';
import { LoadRatingRepository } from './protocols/load-rating-repository';
import { RatingModel } from '../models/rating';
export class RatingMongoRepository
  implements AddRatingRepository, LoadRatingRepository {
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

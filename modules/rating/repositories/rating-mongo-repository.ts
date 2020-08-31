import { AddRatingRepository } from './protocols/add-rating-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { AddRatingModel } from '../usecases/add-rating/add-rating';
import { LoadRatingRepository } from './protocols/load-rating-repository';
import { RatingModel } from '../models/rating';
export class RatingMongoRepository
  implements AddRatingRepository, LoadRatingRepository {
  loadAll(): Promise<RatingModel[]> {
    throw new Error('Method not implemented.');
  }
  async add(ratingData: AddRatingModel): Promise<void> {
    const ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.insertOne(ratingData);
  }
}

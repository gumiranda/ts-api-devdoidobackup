import { AddRatingRepository } from '../../../bin/protocols/repositories/rating/add-rating-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { AddRatingModel } from '../usecases/add-rating/add-rating';
export class RatingMongoRepository implements AddRatingRepository {
  async add(ratingData: AddRatingModel): Promise<void> {
    const ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.insertOne(ratingData);
  }
}

import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { RatingResultModel } from '../../models/rating-result';
import { SaveRatingResultRepository } from './protocols/save-rating-result-repository';
import { database } from 'faker';

export class RatingResultMongoRepository implements SaveRatingResultRepository {
  async save(
    ratingData: Omit<RatingResultModel, '_id'>,
  ): Promise<RatingResultModel> {
    const { ratingId, accountId, result, date } = ratingData;
    const ratingResultCollection = await MongoHelper.getCollection(
      'ratingResults',
    );

    const rest = await ratingResultCollection.findOneAndUpdate(
      {
        ratingId,
        accountId,
      },
      {
        $set: {
          result,
          date,
        },
      },
      { upsert: true, returnOriginal: false },
    );
    return rest.value;
  }
}

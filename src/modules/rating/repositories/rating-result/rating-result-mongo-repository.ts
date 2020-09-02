import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { RatingResultModel } from '../../models/rating-result';
import { SaveRatingResultRepository } from './protocols/save-rating-result-repository';
import { ObjectId } from 'mongodb';
export class RatingResultMongoRepository implements SaveRatingResultRepository {
  async save(
    ratingData: Omit<RatingResultModel, '_id'>,
  ): Promise<RatingResultModel> {
    const { ratingId, accountId, obs, date } = ratingData;
    const ratingResultCollection = await MongoHelper.getCollection(
      'ratingResults',
    );

    const { value } = await ratingResultCollection.findOneAndUpdate(
      {
        ratingId: new ObjectId(ratingId),
        accountId: new ObjectId(accountId),
      },
      {
        $set: {
          obs,
          date,
        },
      },
      { upsert: true },
    );
    const ratingResult = await this.loadByRatingId(ratingId);
    return ratingResult;
  }
  private async loadByRatingId(ratingId: string): Promise<RatingResultModel> {
    const ratingResultCollection = await MongoHelper.getCollection(
      'ratingResults',
    );
    const query = ratingResultCollection.aggregate([
      {
        $match: {
          ratingId: new ObjectId(ratingId),
        },
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: {
          path: '$data',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          foreignField: '_id',
          localField: 'data.ratingId',
          as: 'rating',
        },
      },
      {
        $unwind: {
          path: '$rating',
        },
      },
      {
        $group: {
          _id: {
            ratingId: '$rating._id',
            ratingFor: '$rating.ratingFor',
            date: '$rating.date',
            total: '$count',
            obs: {
              $filter: {
                input: '$rating.ratings',
                as: 'item',
                cond: { $eq: ['$$item.obs', '$data.obs'] },
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $unwind: {
          path: '$_id.obs',
        },
      },
      {
        $addFields: {
          '_id.obs.count': '$count',
          '_id.obs.percent': {
            $multiply: [{ $divide: ['$count', '$_id.total'] }, 100],
          },
        },
      },
      {
        $group: {
          _id: {
            ratingId: '$_id.ratingId',
            ratingFor: '$_id.ratingFor',
            date: '$_id.date',
          },
          ratings: {
            $push: '$_id.obs',
          },
        },
      },
      {
        $project: {
          _id: 0,
          ratingId: '$_id.ratingId',
          ratingFor: '$_id.ratingFor',
          date: '$_id.date',
          ratings: '$ratings',
        },
      },
    ]);
    const ratingResult = await query.toArray();
    return ratingResult[0];
  }
}

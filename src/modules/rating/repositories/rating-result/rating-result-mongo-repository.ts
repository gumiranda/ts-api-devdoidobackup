import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { RatingResultModel } from '../../models/rating-result';
import { SaveRatingResultRepository } from './protocols/save-rating-result-repository';
import { ObjectId } from 'mongodb';
import { SaveRatingResultParams } from '../../usecases/save-rating-result/save-rating-result';
export class RatingResultMongoRepository implements SaveRatingResultRepository {
  async save(ratingData: SaveRatingResultParams): Promise<RatingResultModel> {
    const { ratingId, accountId, rating, date } = ratingData;
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
          rating,
          date,
        },
      },
      { upsert: true },
    );
    const ratingResult = await this.loadByRatingId(ratingId);
    return ratingResult ? ratingResult : value;
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
            ratingType: '$rating.ratingType',
            date: '$rating.date',
            total: '$count',
            rating: {
              $filter: {
                input: '$rating.ratings',
                as: 'item',
                cond: { $eq: ['$$item.rating', '$data.rating'] },
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $unwind: {
          path: '$_id.rating',
        },
      },
      {
        $addFields: {
          '_id.rating.count': '$count',
          '_id.rating.percent': {
            $multiply: [{ $divide: ['$count', '$_id.total'] }, 100],
          },
        },
      },
      {
        $group: {
          _id: {
            ratingId: '$_id.ratingId',
            ratingType: '$_id.ratingType',
            date: '$_id.date',
          },
          ratings: {
            $push: '$_id.rating',
          },
        },
      },
      {
        $project: {
          _id: 0,
          ratingId: '$_id.ratingId',
          ratingType: '$_id.ratingType',
          date: '$_id.date',
          ratings: '$ratings',
        },
      },
    ]);
    const ratingResult = await query.toArray();
    return ratingResult?.length ? ratingResult[0] : null;
  }
}

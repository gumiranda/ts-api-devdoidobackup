import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultRepository } from './protocols/save-rating-result-repository';
import { ObjectId } from 'mongodb';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { QueryBuilder } from '@/bin/helpers/query-builder';
import { LoadRatingResultRepository } from './protocols/load-rating-result-repository';
import { MongoRepository } from '@/bin/base/mongo-repository';
export class RatingResultMongoRepository
  implements SaveRatingResultRepository, LoadRatingResultRepository {
  ratingResultModel: RatingResultModel;
  ratingId: string;
  constructor(private readonly mongoRepository: MongoRepository) {}
  async save(ratingData: SaveRatingResultParams): Promise<void> {
    const { ratingId, accountId, rating, date } = ratingData;
    await this.mongoRepository.update(
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
  }
  async loadByRatingId(ratingId: string): Promise<RatingResultModel> {
    const query = new QueryBuilder()
      .match({
        ratingId: new ObjectId(ratingId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        total: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .lookup({
        from: 'ratings',
        foreignField: '_id',
        localField: 'data.ratingId',
        as: 'rating',
      })
      .unwind({
        path: '$rating',
      })
      .group({
        _id: {
          ratingId: '$rating._id',
          ratingType: '$rating.ratingType',
          date: '$rating.date',
          total: '$total',
          rating: '$data.rating',
          ratings: '$rating.ratings',
        },
        count: {
          $sum: 1,
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        date: '$_id.date',
        ratings: {
          $map: {
            input: '$_id.ratings',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.rating', '$_id.rating'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.rating', '$_id.rating'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          ratingId: '$ratingId',
          ratingType: '$ratingType',
          date: '$date',
        },
        ratings: {
          $push: '$ratings',
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        date: '$_id.date',
        ratings: {
          $reduce: {
            input: '$ratings',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$ratings',
      })
      .group({
        _id: {
          ratingId: '$ratingId',
          ratingType: '$ratingType',
          date: '$date',
          rating: '$ratings.rating',
          stars: '$ratings.stars',
        },
        count: {
          $sum: '$ratings.count',
        },
        percent: {
          $sum: '$ratings.percent',
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        date: '$_id.date',
        rating: {
          rating: '$_id.rating',
          stars: '$_id.stars',
          count: '$count',
          percent: '$percent',
        },
      })
      .sort({
        'rating.count': -1,
      })
      .group({
        _id: {
          ratingId: '$ratingId',
          ratingType: '$ratingType',
          date: '$date',
        },
        ratings: {
          $push: '$rating',
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        date: '$_id.date',
        ratings: '$ratings',
      })
      .build();
    const ratingResult = await this.mongoRepository.aggregate(query);
    return ratingResult?.length ? ratingResult[0] : null;
  }
}

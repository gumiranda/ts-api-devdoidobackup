import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultRepository } from './protocols/save-rating-result-repository';
import { ObjectId } from 'mongodb';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { QueryBuilder } from '@/bin/helpers/query-builder';
import { LoadRatingResultRepository } from './protocols/load-rating-result-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';
export class RatingResultMongoRepository
  implements SaveRatingResultRepository, LoadRatingResultRepository {
  ratingResultModel: RatingResultModel;
  ratingId: string;
  ratingFor: string;

  constructor(private readonly mongoRepository: MongoRepository) {}
  async save(ratingData: SaveRatingResultParams): Promise<void> {
    const { ratingId, ratingFor, userId, rating, createdAt } = ratingData;
    await this.mongoRepository.findOneAndUpdate(
      {
        ratingId: new ObjectId(ratingId),
        ratingFor: new ObjectId(ratingFor),
        userId: new ObjectId(userId),
      },
      {
        $set: {
          rating,
          createdAt,
        },
      },
      { upsert: true },
    );
  }
  async loadByRatingIdRatingFor(
    ratingId: string,
    ratingFor: string,
  ): Promise<RatingResultModel> {
    const query = new QueryBuilder()
      .match({
        ratingId: new ObjectId(ratingId),
        ratingFor: new ObjectId(ratingFor),
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
          createdAt: '$rating.createdAt',
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
        createdAt: '$_id.createdAt',
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
          createdAt: '$createdAt',
        },
        ratings: {
          $push: '$ratings',
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        createdAt: '$_id.createdAt',
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
          createdAt: '$createdAt',
          rating: '$ratings.rating',
          stars: '$ratings.stars',
          comment: '$ratings.comment',
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
        createdAt: '$_id.createdAt',
        rating: {
          rating: '$_id.rating',
          stars: '$_id.stars',
          comment: '$_id.comment',
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
          createdAt: '$createdAt',
        },
        ratings: {
          $push: '$rating',
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        createdAt: '$_id.createdAt',
        ratings: '$ratings',
      })
      .build();
    const ratingResult = await this.mongoRepository.aggregate(query);
    return ratingResult?.length ? ratingResult[0] : null;
  }
}

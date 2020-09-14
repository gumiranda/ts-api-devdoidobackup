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
    const {
      ratingId,
      ratingFor,
      userId,
      rating,
      comment,
      createdAt,
    } = ratingData;
    const res = await this.mongoRepository.add({
      ratingId: new ObjectId(ratingId),
      ratingFor: new ObjectId(ratingFor),
      userId: new ObjectId(userId),
      rating,
      comment,
      createdAt,
    });
    console.error(res);
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
          ratingFor: '$data.ratingFor',
          ratings: '$rating.ratings',
        },
        comments: {
          $push: {
            rating: '$data.rating',
            comment: '$data.comment',
            userId: '$data.userId',
          },
        },
        count: {
          $sum: 1,
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        comments: '$comments',
        ratingFor: '$_id.ratingFor',
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
                  starsAvg: {
                    $cond: {
                      if: {
                        $eq: ['$$item.rating', '$_id.rating'],
                      },
                      then: {
                        $divide: [
                          {
                            $multiply: ['$count', '$$item.stars'],
                          },
                          '$_id.total',
                        ],
                      },
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
          comments: '$comments',
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
        comments: '$_id.comments',
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
          comments: '$comments',
          ratingType: '$ratingType',
          createdAt: '$createdAt',
          rating: '$ratings.rating',
          stars: '$ratings.stars',
        },
        count: {
          $sum: '$ratings.count',
        },
        starsAvg: {
          $sum: '$ratings.starsAvg',
        },
        percent: {
          $sum: '$ratings.percent',
        },
      })
      .match({
        count: {
          $gt: 0,
        },
      })
      .project({
        _id: 0,
        ratingId: '$_id.ratingId',
        ratingType: '$_id.ratingType',
        createdAt: '$_id.createdAt',
        comments: '$_id.comments',
        rating: {
          rating: '$_id.rating',
          stars: '$_id.stars',
          comments: '$_id.comments',
          count: '$count',
          percent: '$percent',
          starsAvg: {
            $sum: '$starsAvg',
          },
        },
      })
      .sort({ 'rating.count': -1 })
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
        starsAvg: {
          $reduce: {
            input: '$ratings.starsAvg',
            initialValue: 0,
            in: { $sum: ['$$value', '$$this'] },
          },
        },
      })
      .build();
    const ratingResult = await this.mongoRepository.aggregate(query);
    console.warn(JSON.stringify(ratingResult));
    return ratingResult?.length ? ratingResult[0] : null;
  }
}

import { AddRatingRepository } from './protocols/add-rating-repository';
import { AddRatingModel } from '@/modules/rating/usecases/add-rating/add-rating';
import { LoadRatingRepository } from './protocols/load-rating-repository';
import { RatingModel } from '@/modules/rating/models/rating';
import { ObjectId } from 'mongodb';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { MongoRepository } from '@/bin/repository/mongo-repository';
export class RatingMongoRepository
  implements AddRatingRepository, LoadRatingRepository, LoadRatingById {
  ratingModel: RatingModel;
  _id: string;
  constructor(private readonly mongoRepository: MongoRepository) {}

  async loadById(_id: string): Promise<RatingModel> {
    const rating: RatingModel = await this.mongoRepository.getOne({
      _id: new ObjectId(_id),
    });
    return rating;
  }
  async loadAll(): Promise<RatingModel[]> {
    const ratings: RatingModel[] = await this.mongoRepository.getAll({});
    return ratings;
  }
  async add(ratingData: AddRatingModel): Promise<void> {
    await this.mongoRepository.add(ratingData);
  }
}

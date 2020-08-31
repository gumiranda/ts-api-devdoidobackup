import { LoadRatingByIdRepository } from '@/modules/rating/repositories/protocols/load-rating-by-id-repository';
import { LoadRatingById } from '../load-rating-by-id';
import { RatingModel } from '@/modules/rating/models/rating';

export class DbLoadRatingById implements LoadRatingById {
  constructor(
    private readonly loadRatingRepository: LoadRatingByIdRepository,
  ) {}
  async loadById(_id: string): Promise<RatingModel> {
    const rating = await this.loadRatingRepository.loadById(_id);
    return rating;
  }
}

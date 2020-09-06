import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import { LoadRatingRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-repository';
import { RatingModel } from '@/modules/rating/models/rating';

export class DbLoadRating implements LoadRating {
  constructor(private readonly loadRatingRepository: LoadRatingRepository) {}
  async load(): Promise<RatingModel[]> {
    return await this.loadRatingRepository.loadAll();
  }
}

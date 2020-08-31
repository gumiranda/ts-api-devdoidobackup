import { LoadRating } from '../load-rating';
import { LoadRatingRepository } from '../../../repositories/protocols/load-rating-repository';
import { RatingModel } from '../../../models/rating';

export class DbLoadRating implements LoadRating {
  constructor(private readonly loadRatingRepository: LoadRatingRepository) {}
  async load(): Promise<RatingModel[]> {
    return await this.loadRatingRepository.loadAll();
  }
}

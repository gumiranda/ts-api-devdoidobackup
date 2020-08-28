import { AddRating, AddRatingModel } from '../add-rating';
import { AddRatingRepository } from '../../../../../bin/protocols/repositories/rating/add-rating-repository';

export class DbAddRating implements AddRating {
  constructor(private readonly addRatingRepository: AddRatingRepository) {}
  async add(data: AddRatingModel): Promise<void> {
    await this.addRatingRepository.add(data);
  }
}

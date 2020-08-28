import { AddRating, AddRatingModel } from '../add-rating';
import { AddRatingRepository } from '../../../repositories/protocols/add-rating-repository';

export class DbAddRating implements AddRating {
  constructor(private readonly addRatingRepository: AddRatingRepository) {}
  async add(data: AddRatingModel): Promise<void> {
    await this.addRatingRepository.add(data);
  }
}

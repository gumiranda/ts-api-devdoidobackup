import {
  AddRating,
  AddRatingModel,
} from '@/modules/rating/usecases/add-rating/add-rating';
import { AddRatingRepository } from '@/modules/rating/repositories/rating/protocols/add-rating-repository';

export class DbAddRating implements AddRating {
  constructor(private readonly addRatingRepository: AddRatingRepository) {}
  async add(data: AddRatingModel): Promise<void> {
    await this.addRatingRepository.add(data);
  }
}

import { CardModel } from '@/modules/payment/models/card-model';
import { DeleteCardByIdRepository } from '@/modules/payment/repositories/card/protocols/delete-card-by-id-repository';
import { DeleteCardById } from '../delete-card-by-id';

export class DbDeleteCardById implements DeleteCardById {
  constructor(
    private readonly deleteCardByIdRepository: DeleteCardByIdRepository,
  ) {}
  async deleteById(_id: string): Promise<CardModel> {
    if (_id) {
      const card = await this.deleteCardByIdRepository.deleteById(_id);
      if (card) {
        return card;
      }
    }
    return null;
  }
}

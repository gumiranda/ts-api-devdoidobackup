import { CardModel } from '@/modules/payment/models/card-model';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';
import { LoadCardById } from '../load-card-by-id';

export class DbLoadCardById implements LoadCardById {
  constructor(
    private readonly loadCardByIdRepository: LoadCardByIdRepository,
  ) {}
  async loadById(card_id: string): Promise<CardModel> {
    if (card_id) {
      const card = await this.loadCardByIdRepository.loadById(card_id);
      if (card) {
        return card;
      }
    }
    return null;
  }
}

import { CardsPaginate } from '@/modules/payment/models/card-model';
import { LoadCardByPageRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-page-repository';
import { LoadCardByPage } from '../load-card-by-page';

export class DbLoadCardByPage implements LoadCardByPage {
  constructor(private readonly loadCardRepository: LoadCardByPageRepository) {}
  async loadByPage(page: number, cardId: string): Promise<CardsPaginate> {
    const cards = await this.loadCardRepository.loadByPage(page, cardId);
    const cardsCount = await this.loadCardRepository.countCardsByPage(cardId);
    return { cards, cardsCount };
  }
}

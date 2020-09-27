import { CardModel } from '@/modules/payment/models/card-model';

export interface LoadCardByPageRepository {
  cards: CardModel[];
  loadByPage(page: number, userId: string): Promise<CardModel[]>;
  countCardsByPage(userId: string): Promise<number>;
}

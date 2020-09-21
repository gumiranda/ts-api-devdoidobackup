import { CardsPaginate } from '../../models/card-model';

export interface LoadCardByPage {
  loadByPage(page: number, cardId: string): Promise<CardsPaginate>;
}

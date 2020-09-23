import { CardsPaginate } from '../../models/card-model';

export interface LoadCardByPage {
  loadByPage(page: number, userId: string): Promise<CardsPaginate>;
}

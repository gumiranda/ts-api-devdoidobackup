import { CardModel } from '@/modules/payment/models/transaction-model';

export interface AddCardRepository {
  add(transactionData: Omit<CardModel, '_id'>): Promise<CardModel>;
}

import 'dotenv/config';
import { TransactionModel } from '../transaction-model';
export const mockFakeTransactionData = (): Omit<TransactionModel, '_id'> => ({
  status: 'string',
  authorization_code: 'string',
  risk_level: 'string',
  acquirer_id: 'string',
  userId: 'string',
  cardId: 'string',
  active: true,
  createdAt: new Date(),
});
export const mockFakeTransactionRequest = (): any => ({
  status: 'string',
  authorization_code: 'string',
  risk_level: 'string',
  acquirer_id: 'string',
  userId: 'string',
  cardHash: process.env.CARD_HASH,
  active: true,
  createdAt: new Date(),
});
export const mockFakeTransaction = (): TransactionModel => ({
  _id: 'valid_id',
  status: 'string',
  authorization_code: 'string',
  risk_level: 'string',
  acquirer_id: 'string',
  userId: 'string',
  cardId: 'string',
  active: true,
  createdAt: new Date(),
});

export const makeFakeArrayTransactions = (): TransactionModel[] => [
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
  mockFakeTransaction(),
];
export const makeFakeArrayAddTransactions = (): Omit<
  TransactionModel,
  '_id'
>[] => [
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
  mockFakeTransactionData(),
];

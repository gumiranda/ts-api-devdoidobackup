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
  card_hash: process.env.CARDHASH,
  city: 'Ribeirão Preto',
  name: 'Gu',
  state: 'SP',
  value: 30,
  complemento: process.env.COMPLEMENTO,
  zipcode: process.env.ZIPCODE,
  neighborhood: process.env.NEIGHBORHOOD,
  street: process.env.STREET,
  email: process.env.EMAIL,
  cpf: process.env.CPF,
  phone: process.env.PHONE,
  street_number: '444',
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

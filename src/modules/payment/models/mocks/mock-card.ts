import { CardModel, CardsPaginate } from '../card-model';

export const mockFakeCardData = (): Omit<CardModel, '_id'> => ({
  card_id: 'string',
  cardNumber: 'string',
  holder_name: 'string',
  name: 'string',
  brand: 'string',
  street: 'string',
  street_number: 'string',
  neighborhood: 'string',
  city: 'string',
  state: 'string',
  zipcode: 'string',
  phone: 'string',
  cpf: 'string',
  email: 'string',
  userId: 'string',
  active: true,
  createdAt: new Date(),
});
export const mockValidCardData = (): CardModel => ({
  card_id: process.env.CARDIDPAGARME,
  cardNumber: 'string',
  holder_name: 'string',
  brand: 'string',
  city: 'Ribeirão Preto',
  name: 'Gu',
  state: 'SP',
  _id: 'valid_id',
  zipcode: process.env.ZIPCODE,
  neighborhood: process.env.NEIGHBORHOOD,
  street: process.env.STREET,
  email: process.env.EMAIL,
  cpf: process.env.CPF,
  phone: process.env.PHONE,
  street_number: '444',
  userId: 'string',
  active: true,
  createdAt: new Date(),
});
export const mockFakeCard = (): CardModel => ({
  _id: 'valid_id',
  card_id: process.env.CARDIDPAGARME,
  cardNumber: 'string',
  holder_name: 'string',
  name: 'string',
  brand: 'string',
  street: 'string',
  street_number: 'string',
  neighborhood: 'string',
  city: 'string',
  state: 'string',
  zipcode: 'string',
  phone: 'string',
  cpf: 'string',
  email: 'string',
  userId: 'string',
  active: true,
  createdAt: new Date(),
});
export const mockFakeCardsPaginated = (): CardsPaginate => ({
  cards: makeFakeArrayCards().slice(0, 10),
  cardsCount: makeFakeArrayCards().length,
});
export const makeFakeArrayCards = (): CardModel[] => [
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
  mockValidCardData(),
];
export const makeFakeArrayAddCards = (): Omit<CardModel, '_id'>[] => [
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
  mockFakeCardData(),
];

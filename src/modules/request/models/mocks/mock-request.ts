import { RequestsPaginate, RequestModel } from '../request-model';
export const mockFakeRequestData = (): Omit<RequestModel, '_id'> => ({
  content: 'string',
  userFor: 'string',
  userBy: 'string',
  read: false,
  type: 'string',
  createdAt: new Date(),
});
export const mockFakeRequest = (): RequestModel => ({
  content: 'string',
  _id: 'any_id',
  userFor: 'string',
  userBy: 'string',
  read: false,
  type: 'string',
  createdAt: new Date(),
});
export const mockFakeRequestReaded = (): RequestModel => ({
  content: 'string',
  _id: 'any_id',
  userFor: 'string',
  userBy: 'string',
  read: true,
  type: 'string',
  createdAt: new Date(),
});
export const mockFakeRequestsPaginated = (): RequestsPaginate => ({
  requests: makeFakeArrayRequests().slice(0, 10),
  requestsCount: makeFakeArrayRequests().length,
});
export const makeFakeArrayRequests = (): RequestModel[] => [
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
  mockFakeRequest(),
];
export const makeFakeArrayAddRequests = (): Omit<RequestModel, '_id'>[] => [
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
  mockFakeRequestData(),
];
export const mockFakeRequestRequest = (userFor): any => ({
  content: 'string',
  userFor,
  type: 'string',
});

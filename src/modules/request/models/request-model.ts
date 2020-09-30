export type RequestModel = {
  _id: string;
  content: string;
  type: string;
  userFor: string;
  userBy: string;
  read: boolean;
  createdAt?: Date;
};
export type RequestsPaginate = {
  requests: RequestModel[];
  requestsCount: number;
};
export type RequestData = Omit<
  RequestModel,
  'content' | 'type' | 'userFor' | 'userBy' | '_id' | 'createdAt'
>;

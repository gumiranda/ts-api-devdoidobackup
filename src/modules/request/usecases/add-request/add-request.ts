import { RequestModel } from '@/modules/request/models/request-model';

export type AddRequestModel = Omit<RequestModel, '_id'>;

export type AddRequest = {
  add(data: AddRequestModel): Promise<RequestModel>;
};

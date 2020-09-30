import {
  RequestData,
  RequestModel,
} from '@/modules/request/models/request-model';

export type UpdateRequest = {
  updateRequest(data: RequestData, requestId: string): Promise<RequestModel>;
};

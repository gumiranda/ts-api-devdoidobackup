import { RequestData, RequestModel } from '../../models/request-model';

export interface UpdateRequestRepository {
  requestModel: RequestModel;
  updateOne(userData: RequestData, userId: string): Promise<RequestModel>;
}

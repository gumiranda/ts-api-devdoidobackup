import { RequestModel } from '../../models/request-model';

export interface LoadRequestByIdRepository {
  requestModel: RequestModel;
  request_id: string;
  loadById(request_id: string): Promise<RequestModel>;
}

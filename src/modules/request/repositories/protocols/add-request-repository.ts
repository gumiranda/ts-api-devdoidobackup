import { AddRequestModel } from '@/modules/request/usecases/add-request/add-request';
import { RequestModel } from '../../models/request-model';

export interface AddRequestRepository {
  add(requestData: AddRequestModel): Promise<RequestModel>;
}

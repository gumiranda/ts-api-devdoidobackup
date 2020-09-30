import { RequestModel } from '../../models/request-model';

export interface LoadRequestById {
  loadById(_id: string): Promise<RequestModel>;
}

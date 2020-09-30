import { RequestModel } from '../../models/request-model';

export interface LoadRequestByPageRepository {
  requests: RequestModel[];
  loadByPage(page: number, userId: string): Promise<RequestModel[]>;
  countRequestsByPage(userId: string): Promise<number>;
}

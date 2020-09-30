import { RequestsPaginate } from '../../models/request-model';

export interface LoadRequestByPage {
  loadByPage(page: number, userId: string): Promise<RequestsPaginate>;
}

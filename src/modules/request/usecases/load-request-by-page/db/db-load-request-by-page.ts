import { RequestsPaginate } from '@/modules/request/models/request-model';
import { LoadRequestByPageRepository } from '@/modules/request/repositories/protocols/load-request-by-page-repository';
import { LoadRequestByPage } from '../load-request-by-page';

export class DbLoadRequestByPage implements LoadRequestByPage {
  constructor(
    private readonly loadRequestRepository: LoadRequestByPageRepository,
  ) {}
  async loadByPage(page: number, userId: string): Promise<RequestsPaginate> {
    const requests = await this.loadRequestRepository.loadByPage(page, userId);
    const requestsCount = await this.loadRequestRepository.countRequestsByPage(
      userId,
    );
    return { requests, requestsCount };
  }
}

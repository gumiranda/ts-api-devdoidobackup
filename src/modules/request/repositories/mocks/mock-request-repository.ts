import {
  makeFakeArrayRequests,
  mockFakeRequest,
} from '../../models/mocks/mock-request';
import { RequestData, RequestModel } from '../../models/request-model';
import { AddRequestRepository } from '../protocols/add-request-repository';
import { LoadRequestByIdRepository } from '../protocols/load-request-by-id-repository';
import { LoadRequestByPageRepository } from '../protocols/load-request-by-page-repository';
import { UpdateRequestRepository } from '../protocols/update-request-repository';

export const mockUpdateRequestRepository = (): UpdateRequestRepository => {
  class UpdateRequestRepositoryStub implements UpdateRequestRepository {
    async updateOne(
      requestData: RequestData,
      requestId: string,
    ): Promise<RequestModel> {
      return new Promise((resolve) => resolve(this.requestModel));
    }
    requestModel = mockFakeRequest();
  }
  return new UpdateRequestRepositoryStub();
};

export const mockAddRequestRepository = (): AddRequestRepository => {
  class AddRequestRepositoryStub implements AddRequestRepository {
    requestModel = mockFakeRequest();
    async add(requestData: Omit<RequestModel, '_id'>): Promise<RequestModel> {
      return new Promise((resolve) => resolve(this.requestModel));
    }
  }
  return new AddRequestRepositoryStub();
};

export const mockLoadRequestByIdRepository = (): LoadRequestByIdRepository => {
  class LoadRequestByIdStub implements LoadRequestByIdRepository {
    request_id: string;
    requestModel = mockFakeRequest();
    async loadById(request_id: string): Promise<RequestModel> {
      this.request_id = request_id;
      if (this.requestModel !== null) {
        this.requestModel._id = request_id;
      }
      return new Promise((resolve) => resolve(this.requestModel));
    }
  }
  return new LoadRequestByIdStub();
};
export const mockLoadRequestByPageRepository = (): LoadRequestByPageRepository => {
  class LoadRequestByPageStub implements LoadRequestByPageRepository {
    requests = makeFakeArrayRequests();
    page: number;
    requestId: string;
    async loadByPage(page: number, requestId: string): Promise<RequestModel[]> {
      this.requestId = requestId;
      this.page = page;
      return new Promise((resolve) => resolve(this.requests?.slice(0, 10)));
    }
    async countRequestsByPage(requestId: string): Promise<number> {
      this.requestId = requestId;
      return new Promise((resolve) => resolve(this.requests?.length));
    }
  }
  return new LoadRequestByPageStub();
};

import {
  makeFakeArrayRequests,
  mockFakeRequest,
  mockFakeRequestReaded,
} from '../../models/mocks/mock-request';
import {
  RequestData,
  RequestModel,
  RequestsPaginate,
} from '../../models/request-model';
import { AddRequest, AddRequestModel } from '../add-request/add-request';
import { LoadRequestById } from '../load-request-by-id/load-request-by-id';
import { LoadRequestByPage } from '../load-request-by-page/load-request-by-page';
import { UpdateRequest } from '../update-request/update-request';

export const mockAddRequest = (): AddRequest => {
  class AddRequestStub implements AddRequest {
    requestModel = mockFakeRequest();
    async add(request: AddRequestModel): Promise<RequestModel> {
      return new Promise((resolve) => resolve(this.requestModel));
    }
  }
  return new AddRequestStub();
};
export const mockLoadRequestByPage = (): LoadRequestByPage => {
  class LoadRequestByPageStub implements LoadRequestByPage {
    requests = makeFakeArrayRequests();
    page: number;
    requestId: string;
    loadByPage(page: number, requestId: string): Promise<RequestsPaginate> {
      this.page = page;
      this.requestId = requestId;
      return new Promise((resolve) =>
        resolve({
          requests: this.requests.slice(0, 10),
          requestsCount: this.requests.length,
        }),
      );
    }
  }
  return new LoadRequestByPageStub();
};
export const mockLoadRequestById = (): LoadRequestById => {
  class LoadRequestByIdStub implements LoadRequestById {
    requestModel = mockFakeRequest();
    _id: string;
    async loadById(_id: string): Promise<RequestModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.requestModel));
    }
  }
  return new LoadRequestByIdStub();
};
export const mockUpdateRequest = (): UpdateRequest => {
  class UpdateRequestStub implements UpdateRequest {
    requestModel = mockFakeRequestReaded();
    async updateRequest(
      request: RequestData,
      requestId: string,
    ): Promise<RequestModel> {
      return new Promise((resolve) => resolve(this.requestModel));
    }
  }
  return new UpdateRequestStub();
};

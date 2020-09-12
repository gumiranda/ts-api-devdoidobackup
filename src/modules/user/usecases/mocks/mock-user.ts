import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';
import {
  UserModel,
  UsersPaginate,
  UserData,
} from '@/modules/user/models/user-model';
import {
  mockFakeUser,
  makeFakeArrayUsers,
  mockFakeUserUpdated,
  mockFakeUserPassword,
} from '@/modules/user/models/mocks/mock-user';
import {
  AddUser,
  AddUserModel,
} from '@/modules/user/usecases/add-user/add-user';
import { LoadUserByPage } from '@/modules/user/usecases/load-user-by-page/load-user-by-page';
import { UpdateUser } from '../update-user/update-user';
import { UpdatePassword } from '../update-password/update-password';
import { LoadUserById } from '../load-user-by-id/load-user-by-id';

export const mockLoadUserByToken = (): LoadUserByToken => {
  class LoadUserByTokenStub implements LoadUserByToken {
    userModel = mockFakeUser('client');
    accessToken: string;
    role: string;
    async load(accessToken: string, role?: string): Promise<UserModel> {
      this.accessToken = accessToken;
      this.role = role;
      return new Promise((resolve) => resolve(this.userModel));
    }
  }
  return new LoadUserByTokenStub();
};

export const mockAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    userModel = mockFakeUser('client');
    async add(user: AddUserModel): Promise<UserModel> {
      //this.userModel = { _id: this.userModel._id, ...user };
      return new Promise((resolve) => resolve(this.userModel));
    }
  }
  return new AddUserStub();
};
export const mockUpdateUser = (): UpdateUser => {
  class UpdateUserStub implements UpdateUser {
    userModel = mockFakeUserUpdated('client');
    async updateUser(
      user: UserData,
      userId: string,
    ): Promise<Omit<UserModel, 'password'>> {
      return new Promise((resolve) => resolve(this.userModel));
    }
  }
  return new UpdateUserStub();
};
export const mockUpdatePassword = (): UpdatePassword => {
  class UpdatePasswordStub implements UpdatePassword {
    userModel = mockFakeUserPassword('client');
    async updatePassword(
      newPassword: string,
      oldPassword: string,
      userId: string,
    ): Promise<Omit<UserModel, 'password'>> {
      return new Promise((resolve) => resolve(this.userModel));
    }
  }
  return new UpdatePasswordStub();
};
export const mockLoadUserByPage = (): LoadUserByPage => {
  class LoadUserByPageStub implements LoadUserByPage {
    users = makeFakeArrayUsers();
    page: number;
    userId: string;
    loadByPage(page: number, userId: string): Promise<UsersPaginate> {
      this.page = page;
      this.userId = userId;
      return new Promise((resolve) =>
        resolve({
          users: this.users.slice(0, 10),
          usersCount: this.users.length,
        }),
      );
    }
  }
  return new LoadUserByPageStub();
};
export const mockLoadUserById = (): LoadUserById => {
  class LoadUserByIdStub implements LoadUserById {
    userModel = mockFakeUser('owner');
    _id: string;
    async loadById(_id: string): Promise<UserModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.userModel));
    }
  }
  return new LoadUserByIdStub();
};

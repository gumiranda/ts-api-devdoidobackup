import {
  AddUser,
  AddUserModel,
} from '@/modules/user/usecases/add-user/add-user';
import { Encrypter } from '@/bin/protocols/crypto/encrypter';
import { AddUserRepository } from '@/modules/user/repositories/protocols/add-user-repository';
import { UserModel } from '@/modules/user/models/user-model';
import { LoadUserByEmailRepository } from '@/modules/user/repositories/protocols/load-user-by-email-repository';

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter;
  private readonly addUserRepository: AddUserRepository;
  private readonly loadUserByEmailRepository: LoadUserByEmailRepository;

  constructor(
    encrypter: Encrypter,
    addUserRepository: AddUserRepository,
    loadUserByEmailRepository: LoadUserByEmailRepository,
  ) {
    this.encrypter = encrypter;
    this.addUserRepository = addUserRepository;
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async add(userData: AddUserModel): Promise<UserModel> {
    const user = await this.loadUserByEmailRepository.loadByEmail(
      userData.email,
    );
    if (!user) {
      const hashedText = await this.encrypter.encrypt(userData.password);
      const newUser = await this.addUserRepository.add(
        Object.assign({}, userData, { password: hashedText }),
      );
      return newUser;
    }
    return null;
  }
}

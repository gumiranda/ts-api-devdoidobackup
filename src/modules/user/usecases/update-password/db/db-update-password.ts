import { UpdatePasswordRepository } from '@/modules/user/repositories/protocols/update-password-repository';
import { UpdatePassword } from '../update-password';
import { HashComparer } from '@/bin/protocols/cryptography/hash-comparer';
import { UserModel } from '@/modules/user/models/user-model';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

export class DbUpdatePassword implements UpdatePassword {
  private readonly updatePasswordRepository: UpdatePasswordRepository;
  private readonly hashComparer: HashComparer;
  private readonly loadUserByIdRepository: LoadUserByIdRepository;
  constructor(
    updatePasswordRepository: UpdatePasswordRepository,
    loadUserByIdRepository: LoadUserByIdRepository,
    hashComparer: HashComparer,
  ) {
    this.updatePasswordRepository = updatePasswordRepository;
    this.loadUserByIdRepository = loadUserByIdRepository;
    this.hashComparer = hashComparer;
  }
  async updatePassword(
    newPassword: string,
    oldPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>> {
    const user = await this.loadUserByIdRepository.loadById(userId);
    if (user) {
      const isValid = await this.hashComparer.compare(
        oldPassword,
        user.password,
      );
      if (isValid) {
        const userUpdatedPassword = await this.updatePasswordRepository.updatePassword(
          newPassword,
          userId,
        );
        return userUpdatedPassword;
      }
    }
    return null;
  }
}

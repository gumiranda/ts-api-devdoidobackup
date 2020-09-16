import { HashComparer } from '@/bin/protocols/cryptography/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/cryptography/token-generator';
import { LoadUserByEmailRepository } from '@/modules/user/repositories/protocols/load-user-by-email-repository';
import { Authentication } from '@/modules/user/usecases/auth/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadUserByEmailRepository: LoadUserByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;
  constructor(
    loadUserByEmailRepository: LoadUserByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }
  async auth(email: string, password: string): Promise<string> {
    const user = await this.loadUserByEmailRepository.loadByEmail(email);
    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password);
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(user._id);
        return accessToken;
      }
    }
    return null;
  }
}

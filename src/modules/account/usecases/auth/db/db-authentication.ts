import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/crypto/token-generator';
import { LoadAccountByEmailRepository } from '@/modules/account/repositories/protocols/load-account-by-email-repository';
import { Authentication } from '@/modules/account/usecases/auth/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }
  async auth(email: string, password: string): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);
    if (account) {
      const isValid = await this.hashComparer.compare(
        password,
        account.password,
      );
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account._id);
        return accessToken;
      }
    }
    return null;
  }
}

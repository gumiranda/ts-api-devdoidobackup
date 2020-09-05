export interface Encrypter {
  hashedPassword: string;
  plaintext: string;
  encrypt(value: string): Promise<string>;
}

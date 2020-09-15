export interface Encrypter {
  hashedText: string;
  plaintext: string;
  encrypt(value: string): Promise<string>;
}

export interface Encrypter {
  hashedPassword: string;
  value: string;
  encrypt(value: string): Promise<string>;
}

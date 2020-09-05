export interface TokenDecrypter {
  plaintext: string;
  decrypt(value: string): Promise<string>;
}

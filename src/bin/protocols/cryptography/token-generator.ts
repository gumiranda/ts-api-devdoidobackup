export interface TokenGenerator {
  ciphertext: string;
  generate(id: string): Promise<string>;
}

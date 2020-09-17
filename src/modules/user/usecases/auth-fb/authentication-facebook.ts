export interface AuthenticationFacebook {
  authFacebook(faceId: string, faceToken: string): Promise<string>;
}

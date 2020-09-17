import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByFaceTokenRepository {
  userModel: UserModel;
  faceId: string;
  faceToken: string;
  loadByFaceToken(faceId: string, faceToken: string): Promise<UserModel>;
}

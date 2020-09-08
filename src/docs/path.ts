import {
  loginPath,
  ratingResultPath,
  signupPath,
  ratingPath,
  userPath,
} from './paths';
import { updatePasswordPath } from './paths/update-password-path';
import { updateUserPath } from './paths/update-user-path';

export default {
  '/user/authenticate': loginPath,
  '/user/page/{page}': userPath,
  '/user/completeRegister': updateUserPath,
  '/user/uploadPassword': updatePasswordPath,
  '/user/register': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/results': ratingResultPath,
};

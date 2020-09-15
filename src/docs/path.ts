import {
  loginPath,
  ratingResultPath,
  signupPath,
  ratingPath,
  updateUserPath,
  userPath,
  updatePasswordPath,
} from './paths';

export default {
  '/user/authenticate': loginPath,
  '/user/page/{page}': userPath,
  '/user/completeRegister': updateUserPath,
  '/user/uploadPassword': updatePasswordPath,
  '/user/register': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/{ratingFor}/results': ratingResultPath,
};

import {
  loginPath,
  ratingResultPath,
  signupPath,
  ratingPath,
  updateUserPath,
  userPath,
  loginFacebookPath,
  updatePasswordPath,
} from './paths';

export default {
  '/user/authenticate': loginPath,
  '/user/authenticateFacebook': loginFacebookPath,
  '/user/page/{page}': userPath,
  '/user/completeRegister': updateUserPath,
  '/user/uploadPassword': updatePasswordPath,
  '/user/register': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/{ratingFor}/results': ratingResultPath,
};

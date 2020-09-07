import {
  loginPath,
  ratingResultPath,
  signupPath,
  ratingPath,
  userPath,
} from './paths';

export default {
  '/user/authenticate': loginPath,
  '/user/page/{page}': userPath,
  '/register': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/results': ratingResultPath,
};

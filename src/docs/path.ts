import {
  loginPath,
  ratingResultPath,
  signupPath,
  ratingPath,
  userPath,
} from './paths';

export default {
  '/login': loginPath,
  '/page': userPath,
  '/signup': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/results': ratingResultPath,
};

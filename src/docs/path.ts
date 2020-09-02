import { loginPath, ratingResultPath, signupPath, ratingPath } from './paths';

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/rating': ratingPath,
  '/ratingResult/{ratingId}/results': ratingResultPath,
};

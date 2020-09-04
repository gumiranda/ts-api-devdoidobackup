import {
  accountSchema,
  loginParamsSchema,
  saveRatingParamsSchema,
  signupParamsSchema,
  errorSchema,
  ratingSchema,
  ratingsSchema,
  ratingResultSchema,
  ratingDetailsSchema,
  addRatingParamsSchema,
  ratingResultRatingSchema,
} from './schemas';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  addRatingParams: addRatingParamsSchema,
  saveRatingParams: saveRatingParamsSchema,
  signupParams: signupParamsSchema,
  error: errorSchema,
  rating: ratingSchema,
  ratings: ratingsSchema,
  ratingResult: ratingResultSchema,
  ratingDetails: ratingDetailsSchema,
  ratingResultRating: ratingResultRatingSchema,
};

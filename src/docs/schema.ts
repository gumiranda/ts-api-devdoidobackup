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
import { userSchema } from './schemas/user-schema';
import { usersSchema } from './schemas/users-schema';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  addRatingParams: addRatingParamsSchema,
  saveRatingParams: saveRatingParamsSchema,
  signupParams: signupParamsSchema,
  error: errorSchema,
  user: userSchema,
  users: usersSchema,
  rating: ratingSchema,
  ratings: ratingsSchema,
  ratingResult: ratingResultSchema,
  ratingDetails: ratingDetailsSchema,
  ratingResultRating: ratingResultRatingSchema,
};

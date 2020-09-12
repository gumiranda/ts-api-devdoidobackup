import {
  tokenSchema,
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
import { updateUserParamsSchema } from './schemas/update-user-params-schema';
import { updatePasswordParamsSchema } from './schemas/update-password-params-schema';

export default {
  token: tokenSchema,
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
  updateUserParams: updateUserParamsSchema,
  updatePasswordParams: updatePasswordParamsSchema,
};

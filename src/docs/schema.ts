import {
  tokenSchema,
  loginParamsSchema,
  loginFacebookParamsSchema,
  saveRatingParamsSchema,
  signupParamsSchema,
  errorSchema,
  ratingSchema,
  ratingsSchema,
  ratingResultSchema,
  ratingDetailsSchema,
  addRatingParamsSchema,
  ratingResultRatingSchema,
  updateUserParamsSchema,
  userSchema,
  updatePasswordParamsSchema,
  usersSchema,
} from './schemas';

export default {
  token: tokenSchema,
  loginParams: loginParamsSchema,
  loginFacebookParams: loginFacebookParamsSchema,
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

import { apiKeyAuthSchema } from './schemas';
import {
  notFound,
  forbidden,
  badRequest,
  serverError,
  unauthorized,
} from './components';

export default {
  securitySchemes: { apiKeyAuth: apiKeyAuthSchema },
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
};

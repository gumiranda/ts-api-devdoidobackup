import paths from './path';
import schemas from './schema';
import components from './component';
export default {
  openapi: '3.0.0',
  info: {
    title: 'API DEV DOIDO',
    description: 'A API mais querida do Brasil',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Signup',
    },
    {
      name: 'Rating',
    },
  ],
  paths,
  schemas,
  components,
};

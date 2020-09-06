import request from 'supertest';
import { app } from '@/bin/configuration/app';
import { noCache } from './no-cache';

describe('noCache Middleware', () => {
  test('Should enable noCache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_no_cache')
      .expect(
        'cache-control',
        'no-store,no-cache,must-revalidate,proxy-revalidate',
      )
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});

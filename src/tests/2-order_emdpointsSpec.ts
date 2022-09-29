import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('creates a new order successfully', async () => {
    const data = {
      user_id: '1',
    };
    const response = await request
      .post('/orders')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });
  it('gets all orders', async () => {
    const response = await request
      .get('/orders')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });
  it('gets order by id', async () => {
    const response = await request
      .get('/orders/1')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });
  it('creates a new order successfully', async () => {
    const data = {
      user_id: '1',
    };
    const response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });
});

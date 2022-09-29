import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('gets all products', async () => {
    const response = await request
      .get('/products')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets a product by id', async () => {
    const response = await request
      .get('/products/1')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('create new product', async () => {
    const data = {
        name: 'gamal',
        price: 200,
    };
    const response = await request
      .post('/products')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });
});

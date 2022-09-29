import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('creates a new customer user successfully', async () => {
    const data = {
      name: 'gamal',
      email: 'gamal@mail.com',
      password: 'passGamal2',
    };
    const response = await request
      .post('/signup/')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });

  it('creates a new usersuccessfully', async () => {
    const data = {
        name: 'gamal',
        email: 'gamal',
        password: 'passGamal2',
    };
    const response = await request
      .post('/signup')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(400);
  });

  it('login successfully', async () => {
    const data = {
        name: 'gamal',
        password: 'passGamal2',
    };
    const response = await request
      .post('/login')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });


  it('gets a user by id ', async () => {
    const response = await request
      .post('/users/1')
      .set('Content-type', 'application/json')
    expect(response.status).toBe(200);

    const token = response.text;

    const get_response = await request
      .get('/users/1')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${token}`);
    expect(get_response.status).toBe(200);
  });
});
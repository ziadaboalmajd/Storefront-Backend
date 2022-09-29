import { userStore } from '../models/Users';

const userstore = new userStore();

describe('user model', () => {
  it('should create method', () => {
    expect(userstore.createUser).toBeDefined();
  });

  it('index method', () => {
    expect(userstore.getUsers).toBeDefined();
  });

  it('should show by id method', () => {
    expect(userstore.getUserById).toBeDefined();
  });

  it('should update method', () => {
    expect(userstore.updateUser).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(userstore.deleteUser).toBeDefined();
  });

  it('should create a new user', async () => {
    const result = await userstore.createUser({
      name: 'ziad',
      email: 'ziad@mail.com',
      password: 'password123',
    });
    expect(result).toBeDefined();
  });

  it('should return the correct user', async () => {
    const result = await userstore.getUserById(1);
    expect(result).toEqual({
      id: 1,
      name: 'ziad',
      email: 'ziad@mail.com',
      password: 'password123',
    } as any);
  });

  it('should update successfully', async () => {
    const result = await userstore.updateUser({
      name: 'ziad',
      password: 'password123',
      newName: "gamal",
      newPassword: "missedudad1"
    });
    expect(result).toEqual({
      name: "gamal",
      email: 'ziad@mail.com',
      password: "missedudad1"
    } as any);
  });
});

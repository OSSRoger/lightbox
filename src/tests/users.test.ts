import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let userId: string;

const testUser = {
  name: faker.person.fullName(),
  age: faker.number.int(999),
  email: faker.internet.email(),
};

// TODO: Add negative tests and edge cases including
// duplicate user
// dupliate email
// invalid email
// invalid age

test.describe('Users API', () => {
  test.beforeAll(async ({ request }) => {
    // Create a user first.
    const userResponse = await request.post('/api/users', {
      data: testUser,
    });
    const user = await userResponse.json();

    userId = user.id;
  });

  test('should get a list of users', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('should get a single user by ID', async ({ request }) => {
    expect(userId).toBeDefined();
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(testUser.name);
    expect(user.age).toBe(testUser.age);
    expect(user.email).toBe(testUser.email);
  });

  test('should update a user', async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      name: faker.person.fullName(),
      age: faker.number.int(999),
      email: faker.internet.email(),
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(udpatedUser.name);
    expect(user.age).toBe(udpatedUser.age);
    expect(user.email).toBe(udpatedUser.email);
  });

  test('should delete a user', async ({ request }) => {
    expect(userId).toBeDefined();
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status()).toBe(204);
  });
});

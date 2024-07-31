import { test, expect } from '@playwright/test';

let userId: string;

test.describe('Users API', () => {
  test('should create a new user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });
    expect(response.status()).toBe(201);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    userId = user.id;
  });

  test('should get a list of users', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('should get a single user by ID', async ({ request }) => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('should update a user', async ({ request }) => {
    const response = await request.put(`/api/users/${userId}`, {
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Jane Doe');
    expect(user.email).toBe('jane@example.com');
  });

  test('should delete a user', async ({ request }) => {
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status()).toBe(204);
  });
});

import { uuid } from 'drizzle-orm/pg-core';
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let userId: string;

const testUser = {
  name: faker.person.fullName(),
  age: faker.number.int(120),
  email: faker.internet.email(),
};

test.describe.serial('Users API', () => {
  test.beforeAll(async ({ request }) => {
    // Create a user first.
    const response = await request.post('/api/users', {
      data: testUser,
    });
    expect(response.status()).toBe(201);
    const user = await response.json();

    userId = user.id;
  });

  test('attempt to create user with duplicate email', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: testUser,
    });

    expect(response.status()).toBe(400);
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
      age: faker.number.int(120),
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
    testUser.name = user.name;
    testUser.age = user.age;
    testUser.email = user.email;
  });

  test('should fail to update a user with non existent userId', async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      name: faker.person.fullName(),
      age: faker.number.int(120),
      email: faker.internet.email(),
    };
    const response = await request.put(`/api/users/${faker.string.uuid()}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(404);
  });

  test("should update user's name only", async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      name: faker.person.fullName(),
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(udpatedUser.name);
    expect(user.age).toBe(testUser.age);
    expect(user.email).toBe(testUser.email);
    testUser.name = user.name;
  });

  test("should fail to update a user's name", async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      name: faker.lorem.sentence(200),
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(400);
  });

  test("should update user's age only", async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      age: faker.number.int(120),
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(testUser.name);
    expect(user.age).toBe(udpatedUser.age);
    expect(user.email).toBe(testUser.email);
    testUser.age = user.age;
  });

  test("should fail to update a user's age to an invalid value", async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      age: 999,
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(400);
  });

  test("should update user's email only", async ({ request }) => {
    expect(userId).toBeDefined();
    const udpatedUser = {
      email: faker.internet.email(),
    };
    const response = await request.put(`/api/users/${userId}`, {
      data: udpatedUser,
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(testUser.name);
    expect(user.age).toBe(testUser.age);
    expect(user.email).toBe(udpatedUser.email);
    testUser.email = user.email;
  });

  test('should fail to update a user with duplicate email', async ({ request }) => {
    expect(userId).toBeDefined();
    const secondUser = {
      name: faker.person.fullName(),
      age: faker.number.int(120),
      email: faker.internet.email(),
    };
    const response = await request.post('/api/users', {
      data: secondUser,
    });
    expect(response.status()).toBe(201);
    const secondUserParsed = await response.json();
    const secondUserId = secondUserParsed.id;

    const updateSecondUser = {
      email: testUser.email,
    };

    const updateSecondUserResponse = await request.put(`/api/users/${secondUserId}`, {
      data: updateSecondUser,
    });
    expect(updateSecondUserResponse.status()).toBe(400);
  });

  test('should delete a user', async ({ request }) => {
    expect(userId).toBeDefined();
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status()).toBe(204);
  });

  test('should delete a user that does not exist', async ({ request }) => {
    expect(userId).toBeDefined();

    const getResponse = await request.get(`/api/users/${userId}`);
    expect(getResponse.status()).toBe(404);

    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status()).toBe(204);
  });
});

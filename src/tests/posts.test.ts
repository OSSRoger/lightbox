import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let postId: string;
let userId: string;

// TODO: test cascade delete of a user and verify that posts are removed.

test.describe('Posts API', () => {
  const testPost = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(2),
  };

  test.beforeAll(async ({ request }) => {
    // Create a user to use for post tests
    const userResponse = await request.post('/api/users', {
      data: {
        name: faker.person.fullName(),
        age: faker.number.int(999),
        email: faker.internet.email(),
      },
    });
    const user = await userResponse.json();

    userId = user.id;
  });

  test('should create a new post', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: { ...testPost, userId },
    });
    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe(testPost.title);
    expect(post.content).toBe(testPost.content);
    expect(post.userId).toBe(userId);
    postId = post.id;
  });

  test('should get a list of posts', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
  });

  test('should get a single post by ID', async ({ request }) => {
    expect(postId).toBeDefined();
    const response = await request.get(`/api/posts/${postId}`);
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe(testPost.title);
    expect(post.content).toBe(testPost.content);
    expect(post.userId).toBe(userId);
  });

  test('should update a post', async ({ request }) => {
    expect(postId).toBeDefined();
    const response = await request.put(`/api/posts/${postId}`, {
      data: {
        title: 'Updated Post',
        content: 'This is the updated content',
        userId: userId,
      },
    });
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('Updated Post');
    expect(post.content).toBe('This is the updated content');
    expect(post.userId).toBe(userId);
  });

  test('should delete a post', async ({ request }) => {
    expect(postId).toBeDefined();
    const response = await request.delete(`/api/posts/${postId}`);
    expect(response.status()).toBe(204);
  });

  test('should delete the user', async ({ request }) => {
    expect(userId).toBeDefined();
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status()).toBe(204);
  });
});

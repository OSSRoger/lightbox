import { test, expect } from '@playwright/test';

let postId: string;
let userId: string;

test.describe('Posts API', () => {
  test.beforeAll(async ({ request }) => {
    // Create a user to use for post tests
    const userResponse = await request.post('/api/users', {
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });
    const user = await userResponse.json();
    userId = user.id;
  });

  test('should create a new post', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'My First Post',
        content: 'This is the content of my first post',
        user_id: userId,
      },
    });
    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('My First Post');
    expect(post.content).toBe('This is the content of my first post');
    expect(post.user_id).toBe(userId);
    postId = post.id;
  });

  test('should get a list of posts', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
  });

  test('should get a single post by ID', async ({ request }) => {
    const response = await request.get(`/api/posts/${postId}`);
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('My First Post');
    expect(post.content).toBe('This is the content of my first post');
    expect(post.user_id).toBe(userId);
  });

  test('should update a post', async ({ request }) => {
    const response = await request.put(`/api/posts/${postId}`, {
      data: {
        title: 'Updated Post',
        content: 'This is the updated content',
        user_id: userId,
      },
    });
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('Updated Post');
    expect(post.content).toBe('This is the updated content');
    expect(post.user_id).toBe(userId);
  });

  test('should delete a post', async ({ request }) => {
    const response = await request.delete(`/api/posts/${postId}`);
    expect(response.status()).toBe(204);
  });
});

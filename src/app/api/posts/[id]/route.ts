import { NextRequest, NextResponse } from 'next/server';
import { deletePost, getPostById, updatePost } from '@/drizzle/db';

/**
 * GET /api/posts/{id}
 *
 * @description Retrieve a post by ID.
 * @request
 * - Method: GET
 * - URL: /api/posts/{id}
 * - Headers: Content-Type: application/json
 *
 * @response
 * - Status: 200 OK
 * - Body: Post object
 *   {
 *     "id": "string",
 *     "title": "string",
 *     "content": "string",
 *     "user_id": "string",
 *     "createdAt": "string (ISO 8601)",
 *     "updatedAt": "string (ISO 8601)"
 *   }
 *
 * @errors
 * - 404 Not Found: Post not found
 *   {
 *     "error": "Post not found"
 *   }
 *
 * @assumptions The post ID exists in the database.
 * @limitations None
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

/**
 * PUT /api/posts/{id}
 *
 * @description Update a post by ID.
 * @request
 * - Method: PUT
 * - URL: /api/posts/{id}
 * - Headers: Content-Type: application/json
 * - Body:
 *   {
 *     "title": "string",
 *     "content": "string",
 *     "user_id": "string"
 *   }
 *
 * @response
 * - Status: 200 OK
 * - Body: Updated post object
 *   {
 *     "id": "string",
 *     "title": "string",
 *     "content": "string",
 *     "user_id": "string",
 *     "createdAt": "string (ISO 8601)",
 *     "updatedAt": "string (ISO 8601)"
 *   }
 *
 * @errors
 * - 404 Not Found: Post not found
 *   {
 *     "error": "Post not found"
 *   }
 *
 * @assumptions The post ID exists in the database.
 * @limitations Request will fail if userId is not found.
 */

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, content, userId } = await request.json();

  // TODO: validate referential integrity.
  const post = await updatePost(params.id, { title, content, userId });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

/**
 * DELETE /api/posts/{id}
 *
 * @description Delete a post by ID.
 * @request
 * - Method: DELETE
 * - URL: /api/posts/{id}
 * - Headers: Content-Type: application/json
 *
 * @response
 * - Status: 204 No Content
 *
 * @errors
 * - 404 Not Found: Post not found
 *   {
 *     "error": "Post not found"
 *   }
 *
 * @assumptions The post ID exists in the database.
 * @limitations None
 */

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // TODO: validate that 204 is still returned if the post is already deleted.
  await deletePost(params.id);
  return new NextResponse(null, { status: 204 });
}

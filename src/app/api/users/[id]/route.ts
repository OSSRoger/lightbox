import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, getUserById, updateUser } from '@/drizzle/db';

/**
 * GET /api/users/{id}
 *
 * @description Retrieve a user by ID.
 * @request
 * - Method: GET
 * - URL: /api/users/{id}
 * - Headers: Content-Type: application/json
 *
 * @response
 * - Status: 200 OK
 * - Body: User object
 *   {
 *     "id": "string",
 *     "name": "string",
 *     "email": "string",
 *     "age": "number",
 *     "createdAt": "string (ISO 8601)",
 *     "updatedAt": "string (ISO 8601)"
 *   }
 *
 * @errors
 * - 404 Not Found: User not found
 *   {
 *     "error": "User not found"
 *   }
 *
 * @assumptions The user ID exists in the database.
 * @limitations None
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

/**
 * PUT /api/users/{id}
 *
 * @description Update a user by ID.
 * @request
 * - Method: PUT
 * - URL: /api/users/{id}
 * - Headers: Content-Type: application/json
 * - Body:
 *   {
 *     "name": "string",
 *     "email": "string",
 *     "age": "number"
 *   }
 *
 * @response
 * - Status: 200 OK
 * - Body: Updated user object
 *   {
 *     "id": "string",
 *     "name": "string",
 *     "email": "string",
 *     "age": "number",
 *     "createdAt": "string (ISO 8601)",
 *     "updatedAt": "string (ISO 8601)"
 *   }
 *
 * @errors
 * - 404 Not Found: User not found
 *   {
 *     "error": "User not found"
 *   }
 * - 400 Bad Request: Age must be a non-negative number
 *   {
 *     "error": "Age must be a non-negative number"
 *   }
 *
 * @assumptions The user ID exists in the database.
 * @limitations None
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { name, age, email } = await request.json();

  if (age && age < 0) {
    return NextResponse.json({ error: 'Age must be a non-negative number' }, { status: 400 });
  }

  const user = await updateUser(params.id, { name, age, email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

/**
 * DELETE /api/users/{id}
 *
 * @description Delete a user by ID.
 * @request
 * - Method: DELETE
 * - URL: /api/users/{id}
 * - Headers: Content-Type: application/json
 *
 * @response
 * - Status: 204 No Content
 *
 * @errors
 * - 404 Not Found: User not found
 *   {
 *     "error": "User not found"
 *   }
 *
 * @assumptions The user ID exists in the database.
 * @limitations None
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // TODO: validate that 204 is still returned if the user is already deleted.
  await deleteUser(params.id);
  return new NextResponse(null, { status: 204 });
}

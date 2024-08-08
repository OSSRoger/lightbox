import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUsers } from './../../../drizzle/db';
import { checkUpsertUserError } from '@/server/utils';
import { UserSchema } from '@/drizzle/schema';

/**
 * GET /api/users
 *
 * @description Retrieve a list of all users.
 * @request
 * - Method: GET
 * - URL: /api/users
 * - Headers: Content-Type: application/json
 *
 * @response
 * - Status: 200 OK
 * - Body: Array of user objects
 *   [
 *     {
 *       "id": "string",
 *       "name": "string",
 *       "email": "string",
 *       "age": "number",
 *       "createdAt": "string (ISO 8601)",
 *       "updatedAt": "string (ISO 8601)"
 *     }
 *   ]
 *
 * @errors None
 * @assumptions Consumer does not yet need pagination or limits.
 * @limitations No limit and no pagination support.
 */
export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);

  // TODO: Implement pagination via querystring params and impose a default response limit.
}

/**
 * POST /api/users
 *
 * @description Create a new user.
 * @request
 * - Method: POST
 * - URL: /api/users
 * - Headers: Content-Type: application/json
 * - Body:
 *   {
 *     "name": "string",
 *     "email": "string",
 *     "age": "number"
 *   }
 *
 * @response
 * - Status: 201 Created
 * - Body: Created user object
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
 * - 400 Bad Request: Name, email, and age are required
 *   {
 *     "error": "Name, email, and age are required"
 *   }
 * - 400 Bad Request: Age must be a non-negative number
 *   {
 *     "error": "Age must be a non-negative number"
 *   }
 *
 * @assumptions The email is unique and valid.
 * @limitations Throws if the specified email violates the unique index constraint.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { name, age, email } = UserSchema.parse(body);
    const newUser = await createUser({ name, age, email });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return checkUpsertUserError(error);
  }
}

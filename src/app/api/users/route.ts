import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUsers } from './../../../drizzle/db';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);

  // TODO: Implement pagination via querystring params and impose a default response limit.
}

export async function POST(request: NextRequest) {
  const { name, age, email } = await request.json();
  if (!name || !age || !email) {
    return NextResponse.json({ error: 'Name, age and email are required' }, { status: 400 });
  }

  const newUser = await createUser({ name, age, email });
  return NextResponse.json(newUser, { status: 201 });
}

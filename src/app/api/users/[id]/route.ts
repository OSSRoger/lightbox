import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, getUserById, updateUser } from '@/drizzle/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const users = await getUserById(params.id);
  const user = users && users.length > 0 ? users[0] : undefined;
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { name, age, email } = await request.json();
  const user = await updateUser(params.id, { name, age, email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function DELETE({ params }: { params: { id: string } }) {
  await deleteUser(params.id);
  return NextResponse.json(null, { status: 204 });
}

import { NextRequest, NextResponse } from 'next/server';
import { deletePost, getPostById, updatePost } from '@/drizzle/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const posts = await getPostById(params.id);
  const post = posts && posts.length > 0 ? posts[0] : undefined;
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, content, userId } = await request.json();
  const post = await updatePost(params.id, { title, content, userId });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE({ params }: { params: { id: string } }) {
  await deletePost(params.id);
  return NextResponse.json(null, { status: 204 });
}

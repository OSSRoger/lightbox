import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPosts } from './../../../drizzle/db';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);

  // TODO: Implement pagination via querystring params and impose a default response limit.
}

export async function POST(request: NextRequest) {
  const { title, content, userId } = await request.json();
  if (!title || !content || !userId) {
    return NextResponse.json({ error: 'title, content and userId are required' }, { status: 400 });
  }

  const newPost = await createPost({ title, content, userId });
  return NextResponse.json(newPost, { status: 201 });
}

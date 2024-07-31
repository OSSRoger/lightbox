import '@/drizzle/env-config';
import { eq } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

import * as schema from './schema';

import { InsertPost, InsertUser, SelectPost, SelectUser, PostsTable, UsersTable } from './schema';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL not defined!');
}

// Connection configuration is pulled from drizzle.config.ts
export const db = drizzle(sql, { schema });

//
// Users
//
export async function getUsers() {
  return db.query.UsersTable.findMany();
}

export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: string;
    name: string;
    age: number;
    email: string;
    updatedAt: Date;
  }>
> {
  return db.select().from(UsersTable).where(eq(UsersTable.id, id));
}

export async function createUser(data: InsertUser) {
  return await db.insert(UsersTable).values(data).returning();
}

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id'>>) {
  return await db.update(UsersTable).set(data).where(eq(UsersTable.id, id)).returning();
}

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(UsersTable).where(eq(UsersTable.id, id));
}

//
// Posts
//
export async function getPosts() {
  return db.query.PostsTable.findMany();
}

export async function createPost(data: InsertPost) {
  await db.insert(PostsTable).values(data).returning();
}

export async function getPostById(id: SelectPost['id']): Promise<
  Array<{
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
  }>
> {
  return db.select().from(PostsTable).where(eq(PostsTable.id, id));
}

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  return await db.update(PostsTable).set(data).where(eq(PostsTable.id, id)).returning();
}

export async function deletePost(id: SelectPost['id']) {
  await db.delete(PostsTable).where(eq(PostsTable.id, id));
}

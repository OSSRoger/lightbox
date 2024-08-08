import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// Define the schema with Drizzle using Zod
export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100, { message: "Name can't exceed 100 characters" }),
  age: z
    .number()
    .min(0, { message: 'Age must be a non-negative number' })
    .max(120, { message: "Age can't exceed 120" }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(100, { message: "Email can't exceed 100 characters" }),
});
export const PartialUserSchema = UserSchema.partial();

export const UsersTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_email_idx').on(users.email),
    };
  }
  // TODO: Consider indexing name for searching.
);

export type InsertUser = typeof UsersTable.$inferInsert;
export type SelectUser = typeof UsersTable.$inferSelect;

export const PostsTable = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }
  // TODO: Consider indexing title for searching.
);

export type InsertPost = typeof PostsTable.$inferInsert;
export type SelectPost = typeof PostsTable.$inferSelect;

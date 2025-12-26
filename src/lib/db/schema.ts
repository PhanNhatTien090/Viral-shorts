import { pgTable, uuid, text, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';

/**
 * Users table
 * Stores user information for the application
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cachedResults = pgTable('cached_results', {
  id: serial('id').primaryKey(),
  // Chúng ta sẽ tạo một "khóa" duy nhất từ input (ví dụ: "meo-giam-can|hai-huoc|tiktok")
  cacheKey: text('cache_key').notNull().unique(), 
  data: jsonb('data').notNull(), // Lưu toàn bộ kết quả (Hook, Script, Visual)
  createdAt: timestamp('created_at').defaultNow(),
});

import { pgTable, uuid, text, timestamp, serial, jsonb, integer } from 'drizzle-orm/pg-core';

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

/**
 * Scripts table
 * Stores user-saved scripts for their library
 */
export const scripts = pgTable('scripts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  title: text('title').notNull(), // Auto-generated from hook or topic
  topic: text('topic'), // Original topic input
  platform: text('platform'), // tiktok, youtube, facebook
  vibe: text('vibe'), // humorous, drama, expert, storytelling
  hook: text('hook').notNull(),
  script: text('script').notNull(),
  cta: text('cta').notNull(),
  visualPrompt: text('visual_prompt'),
  analysis: jsonb('analysis'), // Viral analysis data
  viralScore: integer('viral_score'), // Extracted for easy sorting
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type Script = typeof scripts.$inferSelect;
export type NewScript = typeof scripts.$inferInsert;


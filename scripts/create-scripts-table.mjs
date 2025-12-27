// Run this script to create the scripts table in Supabase
// Usage: node scripts/create-scripts-table.mjs

import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function createScriptsTable() {
    console.log('🔄 Creating scripts table...');

    try {
        await sql`
      CREATE TABLE IF NOT EXISTS scripts (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        topic TEXT,
        platform TEXT,
        vibe TEXT,
        hook TEXT NOT NULL,
        script TEXT NOT NULL,
        cta TEXT NOT NULL,
        visual_prompt TEXT,
        analysis JSONB,
        viral_score INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `;

        console.log('✅ Scripts table created successfully!');

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC)`;

        console.log('✅ Indexes created successfully!');

        // Verify table exists
        const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'scripts'
    `;

        if (result.length > 0) {
            console.log('✅ Verified: scripts table exists in database');
        }

    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        await sql.end();
        console.log('🔌 Database connection closed');
    }
}

createScriptsTable();

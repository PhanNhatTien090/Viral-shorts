// Quick test script to check database scripts table
import { config } from 'dotenv';
import postgres from 'postgres';

// Load .env.local
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not set!');
    process.exit(1);
}

console.log('🔗 Connecting to database...');
console.log('   URL prefix:', connectionString.substring(0, 30) + '...');

const sql = postgres(connectionString, { prepare: false });

async function test() {
    try {
        // 1. Test connection
        const result = await sql`SELECT NOW() as now`;
        console.log('✅ Database connected:', result[0].now);

        // 2. Check if scripts table exists
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'scripts'
    `;

        if (tables.length === 0) {
            console.log('❌ scripts table does NOT exist!');
            console.log('   👉 You need to run the migration first');
            console.log('   👉 Run: psql $DATABASE_URL -f supabase/migrations/001_create_scripts_table.sql');
        } else {
            console.log('✅ scripts table exists');

            // 3. Count scripts
            const count = await sql`SELECT COUNT(*) as count FROM scripts`;
            console.log(`📊 Total scripts in database: ${count[0].count}`);

            // 4. Show all scripts with full user_id
            const scripts = await sql`SELECT id, user_id, title, created_at FROM scripts ORDER BY created_at DESC LIMIT 10`;
            console.log('\n📋 Recent scripts:');
            if (scripts.length === 0) {
                console.log('   (no scripts saved yet)');
            } else {
                scripts.forEach((s) => {
                    console.log(`   - [${s.id}] user_id: "${s.user_id}"`);
                    console.log(`     title: ${s.title.substring(0, 50)}...`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

test();

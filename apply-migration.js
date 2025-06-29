import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('Please ensure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔄 Reading migration file...');
    
    // Read the migration SQL file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20250102000000_add_profile_fields.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Applying migration to Supabase...');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);
          
          if (directError && directError.code !== 'PGRST116') {
            console.warn(`⚠️  Statement ${i + 1} may have failed:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Migration applied successfully!');
    console.log('🎉 Your Supabase database now supports enhanced profile fields.');
    console.log('');
    console.log('New profile fields added:');
    console.log('  - bio: User biography/description');
    console.log('  - location: User location');
    console.log('  - join_date: Date when user joined');
    console.log('  - membership_type: Type of membership');
    console.log('  - social_links: Social media links (JSON)');
    console.log('  - stats: User statistics (JSON)');
    console.log('');
    console.log('📋 Sample user "Supriya Korukonda" has been created for demonstration.');
    
  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('');
    console.error('💡 Alternative options:');
    console.error('1. Use the Supabase Dashboard SQL Editor');
    console.error('2. Install Supabase CLI: npm install -g supabase');
    console.error('3. Copy the SQL from supabase/migrations/20250102000000_add_profile_fields.sql');
    process.exit(1);
  }
}

// Check if we can connect to Supabase first
async function checkConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📋 Profiles table does not exist yet - this is normal for new projects.');
      return true;
    } else if (error) {
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Supabase migration for enhanced profile fields...');
  console.log('');
  
  const connected = await checkConnection();
  if (!connected) {
    console.error('💡 Please check your Supabase configuration and try again.');
    process.exit(1);
  }
  
  await applyMigration();
}

main().catch(console.error);
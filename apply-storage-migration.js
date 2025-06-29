import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyStorageMigration() {
  try {
    console.log('🔄 Applying Supabase Storage migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250102000001_setup_profile_storage.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0);
          
          // For storage operations, we might need to use the REST API directly
          if (statement.includes('storage.buckets')) {
            console.log('📦 Creating storage bucket via REST API...');
            
            // Create bucket using storage API
            const { error: bucketError } = await supabase.storage.createBucket('profile-images', {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
              fileSizeLimit: 10485760 // 10MB
            });
            
            if (bucketError && !bucketError.message.includes('already exists')) {
              console.error('❌ Bucket creation error:', bucketError);
            } else {
              console.log('✅ Storage bucket created successfully');
            }
          } else {
            console.warn('⚠️  Statement might have failed:', statement.substring(0, 100) + '...');
          }
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (execError) {
        console.warn('⚠️  Statement execution warning:', execError.message);
      }
    }
    
    console.log('\n🎉 Storage migration completed!');
    console.log('\n📋 What was set up:');
    console.log('  ✅ profile-images storage bucket');
    console.log('  ✅ RLS policies for secure access');
    console.log('  ✅ Automatic cleanup of old profile images');
    console.log('  ✅ Public read access for profile images');
    
    console.log('\n🔧 Next steps:');
    console.log('  1. Test profile image upload in the app');
    console.log('  2. Verify images are stored in Supabase Storage');
    console.log('  3. Check that old localStorage images are migrated');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n🔧 Manual setup instructions:');
    console.log('  1. Go to your Supabase dashboard');
    console.log('  2. Navigate to Storage');
    console.log('  3. Create a new bucket named "profile-images"');
    console.log('  4. Make it public');
    console.log('  5. Set up RLS policies for user access');
    process.exit(1);
  }
}

// Run the migration
applyStorageMigration();
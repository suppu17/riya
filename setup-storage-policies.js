import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY as fallback)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const policies = [
  {
    name: 'Users can upload profile images',
    sql: `
      CREATE POLICY "Users can upload profile images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'profile-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `
  },
  {
    name: 'Users can update profile images',
    sql: `
      CREATE POLICY "Users can update profile images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'profile-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `
  },
  {
    name: 'Users can delete profile images',
    sql: `
      CREATE POLICY "Users can delete profile images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'profile-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `
  },
  {
    name: 'Public read access',
    sql: `
      CREATE POLICY "Public read access" ON storage.objects
      FOR SELECT USING (bucket_id = 'profile-images');
    `
  }
];

async function setupStoragePolicies() {
  console.log('🔧 Setting up Supabase Storage policies...');
  
  try {
    // First, check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    const profileImagesBucket = buckets.find(bucket => bucket.name === 'profile-images');
    
    if (!profileImagesBucket) {
      console.log('📦 Creating profile-images bucket...');
      const { error: createError } = await supabase.storage.createBucket('profile-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        return;
      }
      
      console.log('✅ Bucket created successfully!');
    } else {
      console.log('✅ Bucket already exists');
    }
    
    // Drop existing policies first (in case they exist)
    console.log('🧹 Cleaning up existing policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can update profile images" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can delete profile images" ON storage.objects;',
      'DROP POLICY IF EXISTS "Public read access" ON storage.objects;'
    ];
    
    for (const dropSql of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: dropSql });
      if (error && !error.message.includes('does not exist')) {
        console.warn('⚠️  Warning dropping policy:', error.message);
      }
    }
    
    // Create new policies
    console.log('📋 Creating storage policies...');
    
    for (const policy of policies) {
      console.log(`   Creating: ${policy.name}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
      
      if (error) {
        console.error(`❌ Error creating policy "${policy.name}":`, error.message);
      } else {
        console.log(`   ✅ ${policy.name}`);
      }
    }
    
    console.log('\n🎉 Storage setup completed!');
    console.log('\n📋 What was configured:');
    console.log('  ✅ profile-images storage bucket');
    console.log('  ✅ User upload permissions');
    console.log('  ✅ User update permissions');
    console.log('  ✅ User delete permissions');
    console.log('  ✅ Public read access');
    console.log('\n🔧 Next steps:');
    console.log('  1. Test profile image upload in your app');
    console.log('  2. Verify images appear in Supabase Storage dashboard');
    console.log('  3. Check that old images are cleaned up automatically');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Alternative method using direct SQL if RPC doesn't work
async function setupWithDirectSQL() {
  console.log('🔄 Trying alternative setup method...');
  
  const allSQL = `
    -- Create policies for profile-images bucket
    ${policies.map(p => p.sql).join('\n\n')}
  `;
  
  console.log('📝 SQL to execute:');
  console.log(allSQL);
  console.log('\n⚠️  Please run this SQL manually in your Supabase SQL Editor:');
  console.log('   1. Go to your Supabase Dashboard');
  console.log('   2. Navigate to SQL Editor');
  console.log('   3. Copy and paste the SQL above');
  console.log('   4. Click "Run"');
}

// Check if we can use RPC, otherwise provide manual instructions
async function main() {
  try {
    // Test if we can use RPC
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql: 'SELECT 1;' });
    
    if (rpcError) {
      console.log('⚠️  RPC method not available, providing manual setup instructions...');
      await setupWithDirectSQL();
    } else {
      await setupStoragePolicies();
    }
  } catch (error) {
    console.log('⚠️  Automated setup failed, providing manual instructions...');
    await setupWithDirectSQL();
  }
}

main().catch(console.error);
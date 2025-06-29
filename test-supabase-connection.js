import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env file has:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log(`📡 URL: ${supabaseUrl}`);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test storage bucket
    console.log('\n🗂️  Testing storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Storage access failed:', bucketError.message);
    } else {
      console.log('✅ Storage access successful');
      
      const profileBucket = buckets.find(bucket => bucket.name === 'profile-images');
      if (profileBucket) {
        console.log('✅ profile-images bucket exists');
        console.log(`   - Public: ${profileBucket.public}`);
        console.log(`   - Created: ${profileBucket.created_at}`);
      } else {
        console.log('❌ profile-images bucket NOT found');
        console.log('📋 Available buckets:', buckets.map(b => b.name).join(', '));
      }
    }
    
    // Test storage policies
    console.log('\n🔐 Testing storage policies...');
    try {
      const { data: testUpload, error: uploadError } = await supabase.storage
        .from('profile-images')
        .list('', { limit: 1 });
        
      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          console.log('❌ Bucket not found - needs to be created');
        } else if (uploadError.message.includes('policy')) {
          console.log('❌ RLS policies not set up properly');
        } else {
          console.log('❌ Storage error:', uploadError.message);
        }
      } else {
        console.log('✅ Storage policies working');
      }
    } catch (err) {
      console.log('❌ Storage test failed:', err.message);
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Follow the instructions in MANUAL_STORAGE_SETUP.md');
  console.log('4. Create the profile-images bucket if it doesn\'t exist');
  console.log('5. Run the SQL policies in the SQL Editor');
}

testConnection();
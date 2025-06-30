// Auth Test Script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Auth Configuration...');
console.log('URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

async function testAuth() {
  try {
    console.log('\n🔄 Testing basic connection...');
    
    // Test 1: Basic connection
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Session check successful');
      console.log('Current session:', session?.user ? 'User logged in' : 'No active session');
    }
    
    // Test 2: Auth state listener
    console.log('\n🔄 Testing auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email || 'no user');
    });
    
    // Test 3: Test login with invalid credentials (should fail gracefully)
    console.log('\n🔄 Testing login error handling...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@invalid.com',
      password: 'wrongpassword'
    });
    
    if (loginError) {
      console.log('✅ Login error handling works:', loginError.message);
    } else {
      console.log('⚠️ Unexpected login success with invalid credentials');
    }
    
    // Test 4: Check auth settings
    console.log('\n🔄 Testing auth configuration...');
    console.log('Auth URL:', supabase.supabaseUrl + '/auth/v1');
    
    // Cleanup
    subscription.unsubscribe();
    
    console.log('\n✅ Auth tests completed');
    
  } catch (error) {
    console.error('❌ Critical error during auth test:', error);
  }
}

testAuth();
// Comprehensive Auth Debug Script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      }
    },
    storageKey: 'sb-auth-token',
    debug: true
  }
});

async function debugAuth() {
  console.log('🔍 Starting comprehensive auth debug...');
  
  try {
    // Step 1: Check current session
    console.log('\n📋 Step 1: Checking current session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else {
      console.log('✅ Session check successful');
      console.log('Current session:', sessionData.session ? 'Active' : 'None');
      if (sessionData.session) {
        console.log('User:', sessionData.session.user.email);
        console.log('Expires at:', new Date(sessionData.session.expires_at * 1000));
      }
    }
    
    // Step 2: Test auth state listener
    console.log('\n📋 Step 2: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Auth event: ${event}`);
      if (session) {
        console.log(`   User: ${session.user.email}`);
        console.log(`   Access token: ${session.access_token.substring(0, 20)}...`);
      } else {
        console.log('   No session');
      }
    });
    
    // Step 3: Test with a real login attempt (you'll need to provide credentials)
    console.log('\n📋 Step 3: Testing login flow...');
    console.log('ℹ️ To test login, you need to manually provide credentials');
    console.log('ℹ️ Or check the browser console for real-time auth events');
    
    // Step 4: Check storage
    console.log('\n📋 Step 4: Checking local storage...');
    if (typeof window !== 'undefined') {
      const authToken = window.localStorage.getItem('sb-auth-token');
      console.log('Auth token in storage:', authToken ? 'Present' : 'None');
      
      // List all supabase-related storage keys
      const supabaseKeys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          supabaseKeys.push(key);
        }
      }
      console.log('Supabase storage keys:', supabaseKeys);
    }
    
    // Step 5: Test user retrieval
    console.log('\n📋 Step 5: Testing user retrieval...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User retrieval error:', userError);
    } else {
      console.log('✅ User retrieval successful');
      console.log('User data:', userData.user ? userData.user.email : 'No user');
    }
    
    console.log('\n✅ Auth debug completed');
    console.log('\n💡 Next steps:');
    console.log('1. Open browser console to see real-time auth events');
    console.log('2. Try logging in through the UI');
    console.log('3. Watch for auth state changes in the console');
    
    // Keep the subscription active for a while to catch events
    setTimeout(() => {
      subscription.unsubscribe();
      console.log('🔚 Auth listener unsubscribed');
    }, 30000);
    
  } catch (error) {
    console.error('❌ Critical error during auth debug:', error);
  }
}

// Run the debug
debugAuth();

// Export for browser use
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
  window.supabaseDebug = supabase;
}
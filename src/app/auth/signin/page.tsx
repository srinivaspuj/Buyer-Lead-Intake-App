'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/buyers');
    }
  }, [session, router]);

  const handleDemoLogin = () => {
    signIn('demo', { 
      email: 'demo@example.com',
      callbackUrl: '/buyers'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              LeadManager Pro
            </h1>
            <p className="text-blue-100 mb-8 text-lg">Transform your lead management experience</p>
            
            <button
              onClick={handleDemoLogin}
              className="group w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Launch Dashboard
            </button>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs text-blue-200">Analytics</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-xs text-blue-200">Fast Setup</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">💎</div>
                <div className="text-xs text-blue-200">Premium</div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-blue-200/80">
              <p className="mb-2">✨ What's included:</p>
              <div className="space-y-1">
                <p>• Advanced lead tracking &amp; management</p>
                <p>• Real-time search & intelligent filters</p>
                <p>• Seamless CSV import/export tools</p>
                <p>• Beautiful analytics dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
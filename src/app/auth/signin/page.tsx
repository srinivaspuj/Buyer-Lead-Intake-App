'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/buyers');
    }
  }, [session, router]);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const result = await signIn('demo', { 
      redirect: false,
      callbackUrl: '/buyers'
    });
    if (result?.ok) {
      router.push('/buyers');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-3">
              LeadFlow
            </h1>
            <p className="text-purple-200 text-lg font-medium">Professional Lead Management</p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="group w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Launching...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Enter Dashboard
                </>
              )}
            </div>
          </button>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📈</div>
              <div className="text-sm font-medium text-white">Analytics</div>
              <div className="text-xs text-purple-200">Real-time insights</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <div className="text-sm font-medium text-white">Fast Setup</div>
              <div className="text-xs text-purple-200">Ready in seconds</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <div className="text-sm font-medium text-white">Secure</div>
              <div className="text-xs text-purple-200">Enterprise grade</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💎</div>
              <div className="text-sm font-medium text-white">Premium</div>
              <div className="text-xs text-purple-200">Pro features</div>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm mb-4">
              <span className="text-sm text-purple-200">✨ Premium Features Included</span>
            </div>
            <div className="space-y-2 text-sm text-purple-100">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced lead tracking and management
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Smart search and filtering system
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                CSV import and export tools
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-xs">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Demo Mode - No registration required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              card: 'bg-gray-900 border border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-gray-800 border-gray-600 text-white',
              footerActionLink: 'text-blue-400 hover:text-blue-300'
            }
          }}
          redirectUrl="/"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
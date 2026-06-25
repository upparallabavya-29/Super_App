import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your personal SuperApp dashboard.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-black">
      {/* Left Panel: Cover Image and Branding */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative overflow-hidden h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
          style={{
            backgroundImage: "url('/signup_bg.png')",
          }}
        />
        {/* Overlay to darken image for text contrast */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Cursive Brand Logo Top Left */}
        <div className="relative z-10">
          <span
            className="text-4xl text-[#72DB73] font-normal tracking-wide select-none"
            style={{ fontFamily: 'var(--font-cursive)' }}
          >
            Super app
          </span>
        </div>

        {/* Catchy headline at the bottom */}
        <div className="relative z-10 max-w-sm mb-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight font-display tracking-tight">
            Discover new things on Superapp
          </h2>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 bg-black overflow-y-auto min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo and Greeting Header */}
          <div className="text-center mb-8">
            <h1
              className="text-5xl text-[#72DB73] font-normal mb-3 select-none"
              style={{ fontFamily: 'var(--font-cursive)' }}
            >
              Super app
            </h1>
            <p className="text-white text-base font-semibold font-sans tracking-wide">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="w-full mb-6">
            <LoginForm />
          </div>

          {/* Register redirection link */}
          <p className="text-center text-sm text-white/50">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#72DB73] hover:underline hover:text-[#5fc460] font-semibold transition-colors duration-150"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Field is required'),
  mobile: z.string().min(1, 'Field is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { registeredUsers, setUser, clearUser } = useUserStore();
  const { clearCategories } = useCategoriesStore();
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    clearUser();
    clearCategories();
  }, [clearUser, clearCategories]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setGlobalError(null);

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const identifier = data.identifier.trim().toLowerCase();
      const mobile = data.mobile.trim();

      // Find user in local mock database
      const existingUser = registeredUsers.find(
        (u) =>
          (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier) &&
          u.mobile === mobile
      );

      if (existingUser) {
        setUser(existingUser);
        router.push('/dashboard');
      } else {
        setGlobalError('Invalid credentials. Please check your details or register a new account.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setGlobalError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {globalError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {globalError}
        </div>
      )}

      {/* Username or Email Input */}
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Username or Email"
          className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
            errors.identifier ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
          }`}
          {...register('identifier')}
          disabled={isSubmitting}
        />
        {errors.identifier && (
          <p className="text-xs text-red-500 font-sans pl-1">{errors.identifier.message}</p>
        )}
      </div>

      {/* Mobile Input */}
      <div className="flex flex-col gap-1">
        <input
          type="tel"
          placeholder="Mobile Number"
          className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
            errors.mobile ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
          }`}
          {...register('mobile')}
          disabled={isSubmitting}
        />
        {errors.mobile && (
          <p className="text-xs text-red-500 font-sans pl-1">{errors.mobile.message}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#72DB73] hover:bg-[#5fc460] text-black py-3 px-4 rounded-full font-bold text-lg tracking-wider uppercase shadow-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-12"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'SIGN IN'
          )}
        </button>
      </div>
    </form>
  );
}

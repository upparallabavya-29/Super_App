'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';

// Cuvette-compliant schema
const registrationSchema = z.object({
  name: z.string().min(1, 'Field is required'),
  username: z.string().min(1, 'Field is required'),
  email: z.string().min(1, 'Field is required').email('Invalid email address'),
  mobile: z
    .string()
    .min(1, 'Field is required')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile number'),
  shareData: z.literal(true, {
    errorMap: () => ({ message: 'Check this box if you want to proceed' }),
  }),
});

type RegistrationFormFields = z.infer<typeof registrationSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

export function RegistrationForm() {
  const router = useRouter();
  const { registerUser, clearUser } = useUserStore();
  const { clearCategories } = useCategoriesStore();

  useEffect(() => {
    clearUser();
    clearCategories();
  }, [clearUser, clearCategories]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormFields>({
    resolver: zodResolver(registrationSchema),
    mode: 'onSubmit', // Validate on submit to match Cuvette flow
  });

  const onSubmit = async (data: RegistrationFormFields) => {
    try {
      // Create user record
      const newUser = {
        id: crypto.randomUUID(),
        name: data.name,
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        createdAt: new Date().toISOString(),
      };

      // Register and set active user in Zustand store
      registerUser(newUser);

      // Brief delay for premium transition
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push('/categories');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="User registration form"
        className="space-y-4"
      >
        {/* Name Input */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Name"
            autoComplete="name"
            className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
              errors.name ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
            }`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-sans pl-1">{errors.name.message}</p>
          )}
        </motion.div>

        {/* Username Input */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
              errors.username ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
            }`}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-xs text-red-500 font-sans pl-1">{errors.username.message}</p>
          )}
        </motion.div>

        {/* Email Input */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
              errors.email ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-sans pl-1">{errors.email.message}</p>
          )}
        </motion.div>

        {/* Mobile Input */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <input
            type="tel"
            placeholder="Mobile"
            autoComplete="tel"
            className={`w-full bg-[#292929] text-white placeholder-[#7C7C7C] rounded-lg px-4 py-3 text-base outline-none border transition-all duration-150 ${
              errors.mobile ? 'border-red-500' : 'border-transparent focus:border-[#72DB73]'
            }`}
            {...register('mobile')}
          />
          {errors.mobile && (
            <p className="text-xs text-red-500 font-sans pl-1">{errors.mobile.message}</p>
          )}
        </motion.div>

        {/* Consent Checkbox */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded accent-[#72DB73] bg-[#292929] border-none"
              {...register('shareData')}
            />
            <span className="text-[#7C7C7C] text-sm leading-tight">
              Share my registration data with Superapp
            </span>
          </label>
          {errors.shareData && (
            <p className="text-xs text-red-500 font-sans pl-1">{errors.shareData.message}</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="pt-2">
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
              'SIGN UP'
            )}
          </button>
        </motion.div>

        {/* Terms Copy */}
        <motion.div variants={itemVariants} className="pt-2 space-y-2 select-none text-left">
          <p className="text-[#7C7C7C] text-[13px] leading-snug">
            By clicking on Sign up, you agree to Superapp{' '}
            <span className="text-[#72DB73] hover:underline cursor-pointer">
              Terms and Conditions of Use
            </span>
          </p>
          <p className="text-[#7C7C7C] text-[13px] leading-snug">
            To learn more about how Superapp collects, uses, shares and protects your personal
            data please head{' '}
            <span className="text-[#72DB73] hover:underline cursor-pointer">
              Superapp Privacy Policy
            </span>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
}

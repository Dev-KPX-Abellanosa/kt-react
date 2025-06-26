import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { tw } from '../../../libs/tw';
import { useAuth } from '../../../libs/hooks/useAuth';
import { Link } from 'react-router';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data.email, data.password, data.name);
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-6 w-96">
          <h1 className="text-2xl font-semibold mb-6">Create Account</h1>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Full Name</label>
              <input 
                className={tw("border-2 border-gray-300 rounded-md p-2", errors.name ? "border-red-500" : "")} 
                type="text" 
                id="name" 
                {...register("name")} 
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input 
                className={tw("border-2 border-gray-300 rounded-md p-2", errors.email ? "border-red-500" : "")} 
                type="email" 
                id="email" 
                {...register("email")} 
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input 
                className={tw("border-2 border-gray-300 rounded-md p-2", errors.password ? "border-red-500" : "")} 
                type="password" 
                id="password" 
                {...register("password")} 
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                className={tw("border-2 border-gray-300 rounded-md p-2", errors.confirmPassword ? "border-red-500" : "")} 
                type="password" 
                id="confirmPassword" 
                {...register("confirmPassword")} 
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              className={tw("bg-blue-500 text-white rounded-md p-2 mt-2", isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600")} 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
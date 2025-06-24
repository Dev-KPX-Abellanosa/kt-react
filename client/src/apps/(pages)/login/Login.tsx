import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { tw } from '../../../libs/tw';
import { useAuth } from '../../../libs/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password);
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-4">
          <p className="text-xl font-semibold">Login</p>

          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input className={tw("border-2 border-gray-300 rounded-md p-2", errors.email ? "border-red-500" : "")} type="email" id="email"   {...register("email")} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="password">Password</label>
              <input className={tw("border-2 border-gray-300 rounded-md p-2", errors.password ? "border-red-500" : "")} type="password" id="password"  {...register("password")} />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <button className={tw("bg-blue-500 text-white rounded-md p-2", isLoading ? "opacity-50 cursor-not-allowed" : "")} type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Login"}</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

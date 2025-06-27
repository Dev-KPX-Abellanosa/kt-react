import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { tw } from '../../../libs/tw';
import { useAuth } from '../../../libs/hooks/useAuth';
import { Link } from 'react-router';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, error, isLoading } = useAuth();
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
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-6 w-96">
          <h1 className="text-2xl font-semibold mb-6">Sign In</h1>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}>
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

            <button
              className={tw("bg-blue-500 text-white rounded-md p-2 mt-2", isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600")}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-600">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Mail, Lock, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useState } from "react";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, "Email is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .min(1, "Password is required."),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (values) => {
    setApiError(null);

    try {
      // Call mock API
      const response = await authApi.login(values);

      // Store user and token in Redux
      dispatch(loginAction(response.user));

      console.log("✅ Login successful:", response.user);
      navigate("/");
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      setApiError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className='min-h-[100dvh] bg-gray-50 md:flex md:items-center md:justify-center p-0 sm:p-4'>
      <Card className='w-full h-[100dvh] rounded-none border-0 shadow-none flex flex-col justify-center sm:h-auto sm:max-w-md sm:rounded-lg sm:border-gray-200 sm:shadow-xl'>
        <CardHeader className='text-center pt-8 pb-4'>
          <CardTitle className='text-2xl font-semibold text-gray-800'>
            Finance Manager Login
          </CardTitle>
          <CardDescription className='text-gray-500 mt-1'>
            Sign in using your work email and password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  className={`pl-10 h-11 ${
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className='text-sm text-red-500 mt-1 '>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  className={`pl-10 h-11 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <p className='text-sm text-red-600'>{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full h-11 text-lg font-medium bg-brand hover:bg-brand-hover transition duration-150'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Logging In..."
              ) : (
                <>
                  <LogIn className='mr-2 h-5 w-5' /> Login
                </>
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className='flex justify-center pb-8'>
          <p className='text-sm text-gray-500'>
            Having trouble?{" "}
            <a
              href='#'
              className='font-medium text-brand hover:text-brand-hover'
            >
              Contact your administrator.
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

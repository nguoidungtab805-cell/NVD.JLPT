// FILE: app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginWithEmail, loginWithGoogle } from "../../../firebase/auth";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await loginWithEmail(data.email, data.password);
      router.push(redirectUrl);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          setErrorMsg("Email hoặc mật khẩu không chính xác.");
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMsg("Tài khoản bị tạm khóa do đăng nhập sai nhiều lần. Hãy thử lại sau.");
        } else {
          setErrorMsg("Có lỗi xảy ra: " + error.message);
        }
      } else {
        setErrorMsg("Lỗi hệ thống. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      await loginWithGoogle();
      router.push(redirectUrl);
    } catch (error: any) {
      setErrorMsg("Đăng nhập Google thất bại. Hãy thử lại.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-jp-navy mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục lộ trình học JLPT</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-jp-red text-sm rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="vd: hocvien@nvdjlpt.com"
            error={errors.email?.message as string}
            {...register("email", { 
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ"
              }
            })}
          />
          
          <div className="space-y-1">
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message as string}
              {...register("password", { 
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự"
                }
              })}
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-jp-orange hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Đăng nhập
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-200" />
          <span className="p-2 text-gray-400 text-sm bg-white">Hoặc</span>
          <hr className="w-full border-gray-200" />
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4 flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Tiếp tục với Google
        </Button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-jp-orange font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

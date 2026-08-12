// FILE: app/(auth)/register/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerWithEmail } from "../../../firebase/auth";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FirebaseError } from "firebase/app";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  // Dùng watch để theo dõi giá trị password, phục vụ cho việc kiểm tra confirm password
  const password = watch("password");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await registerWithEmail(data.email, data.password, data.name, data.phone);
      setSuccessMsg("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      // Tùy chọn: Chuyển hướng người dùng về trang login sau vài giây
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMsg("Email này đã được sử dụng. Vui lòng đăng nhập.");
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

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-jp-navy mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-500 text-sm">Bắt đầu hành trình chinh phục JLPT cùng NVD.JLPT</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-jp-red text-sm rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="vd: Nguyễn Văn A"
            error={errors.name?.message as string}
            {...register("name", { required: "Vui lòng nhập họ và tên" })}
          />

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

          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="vd: 0901234567"
            error={errors.phone?.message as string}
            {...register("phone", { 
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: "Số điện thoại không hợp lệ"
              }
            })}
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            error={errors.password?.message as string}
            {...register("password", { 
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
              }
            })}
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            error={errors.confirmPassword?.message as string}
            {...register("confirmPassword", { 
              required: "Vui lòng xác nhận mật khẩu",
              validate: value => value === password || "Mật khẩu không khớp"
            })}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Đăng ký tài khoản
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-jp-orange font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

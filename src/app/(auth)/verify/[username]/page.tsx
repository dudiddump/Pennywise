"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
        code: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleResend = async () => {
    // Implement resend logic here
    toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
    });
  }

  return (
    <div className="relative min-h-screen w-full bg-[#091C2D] text-white flex flex-col font-poppins overflow-hidden">
      {/* Background radial gradient effects */}
      <div className="absolute top-[-25%] left-[-25%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(22,163,74,0.2)_0%,_transparent_60%)] -z-0"></div>
      <div className="absolute bottom-[-25%] right-[-25%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.15)_0%,_transparent_60%)] -z-0"></div>

      {/* Header with Back button */}
      <header className="absolute top-0 left-0 p-6 z-20">
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/10 text-white p-2 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
        </Button>
      </header>

      <main className="relative z-10 flex-grow flex flex-col justify-center items-center w-full px-6">
        <div className="w-full max-w-md flex flex-col items-center">
            <div className="mb-6">
                <Lock className="w-20 h-20 text-[#34D399]" />
            </div>
            <div className="w-full text-center mb-8">
                <h1 className="text-4xl font-bold">OTP Verification</h1>
                <p className="text-gray-400 mt-2">Enter the OTP sent to your email</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormLabel className="sr-only">Verification Code</FormLabel>
                                <FormControl>
                                    <InputOTP 
                                        maxLength={7} 
                                        {...field}
                                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={1} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={2} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={3} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={4} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={5} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                            <InputOTPSlot index={6} className="bg-white/5 border-gray-600 h-12 w-12 text-xl rounded-lg" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="text-center text-sm text-gray-400">
                        Didn&apos;t receive OTP?{' '}
                        <Button variant="link" onClick={handleResend} className="text-[#34D399] p-0 h-auto">
                            RESEND
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#34D399] text-[#0D1117] font-bold py-3 h-12 text-base rounded-lg hover:bg-[#2cb985] transition-all duration-300 transform hover:scale-105"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                    </Button>
                </form>
            </Form>
        </div>
      </main>
      <footer className="relative z-10 w-full flex-shrink-0 pb-8 flex justify-center">
        <Image 
          src="/pennywise-logo.png"
          alt="Pennywise Logo"
          width={40}
          height={40}
        />
      </footer>
    </div>
  );
};

export default VerifyAccount;

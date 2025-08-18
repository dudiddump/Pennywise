"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Google Icon SVG Component
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
        <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" fill="#4285F4"/>
        <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z" fill="#34A853"/>
        <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z" fill="#FBBC05"/>
        <path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z" fill="#EA4335"/>
    </svg>
);

function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    setLoading(false);

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect username or password.",
        variant: "destructive",
      });
    } else if (result?.url) {
      router.replace("/home");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/home",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0D1117] to-[#162B2B] text-white flex flex-col p-6 font-sans">
      <header className="w-full max-w-md mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/10 text-white">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-sm mx-auto -mt-10">
        <div className="w-full text-left mb-8">
            <h1 className="text-4xl font-bold mb-2">Login</h1>
            <p className="text-gray-400">Welcome! Please enter your details.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <Label className="text-gray-300">Email or Username</Label>
                            <Input 
                                {...field} 
                                placeholder="Enter email or username"
                                className="bg-white/5 border-gray-600 focus:border-[#34D399] h-12 rounded-lg text-base"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label className="text-gray-300">Password</Label>
                            <Input 
                                {...field} 
                                type="password"
                                placeholder="Enter password"
                                className="bg-white/5 border-gray-600 focus:border-[#34D399] h-12 rounded-lg text-base"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#34D399] text-[#0D1117] font-bold py-3 h-12 text-base rounded-lg hover:bg-[#2cb985] transition-all duration-300 transform hover:scale-105"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
            </form>
        </Form>

        <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full border-2 border-[#34D399] text-white font-bold py-3 h-12 text-base rounded-lg hover:bg-[#34D399] hover:text-[#0D1117] transition-all duration-300 mt-4 transform hover:scale-105"
        >
            <GoogleIcon />
            Continue with Google
        </Button>

        <p className="text-sm mt-8 text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#34D399] font-semibold hover:underline">
                Register Here
            </Link>
        </p>
      </main>

      <footer className="w-full max-w-sm mx-auto text-center pb-4">
        {/* Footer content can go here if needed in the future */}
      </footer>
    </div>
  );
}

export default SignInForm;

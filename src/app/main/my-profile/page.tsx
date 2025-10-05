"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  monthlySalary: z.number().min(0, "Salary must be a positive number"),
  savingsPercentage: z.number().min(0, "Percentage must be between 0 and 100").max(100),
});

const MyProfilePage = () => {
  const { data: session, update } = useSession();
  const user: User = session?.user as User;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      monthlySalary: 0,
      savingsPercentage: 20,
    },
  });
  
  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/user');
      if (response.data.success && response.data.data) {
        const userData = response.data.data as any;
        form.reset({
          fullName: userData.fullName,
          monthlySalary: userData.monthlySalary || 0,
          savingsPercentage: userData.savingsPercentage || 20,
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch profile data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [form, toast]);

  useEffect(() => {
    if (session) {
      fetchProfileData();
    }
  }, [session, fetchProfileData]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put<ApiResponse>('/api/user/update-profile', data);
      toast({ title: "Success", description: response.data.message });
      
      await update({
        ...session,
        user: {
            ...session?.user,
            name: data.fullName,
        }
      });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Update Failed",
        description: axiosError.response?.data.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full font-poppins text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-[#34D399] to-[#3B82F6] bg-clip-text text-transparent">
          My Profile
        </h1>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View and update your personal and financial details here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !form.formState.isDirty ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" /></div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-white/5 border-gray-600" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="flex items-center gap-2 p-3 h-10 rounded-md bg-white/10 border border-gray-700">
                           <Mail size={16} className="text-gray-400" /> <span>{user?.email}</span>
                        </div>
                    </div>
                     <FormField
                        control={form.control}
                        name="monthlySalary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Salary ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" className="bg-white/5 border-gray-600" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="savingsPercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Savings Commitment (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" className="bg-white/5 border-gray-600" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" className="bg-gradient-to-r from-[#34D399] to-[#3B82F6]" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Save Changes
                    </Button>
                </div>
              </form>
            </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProfilePage;

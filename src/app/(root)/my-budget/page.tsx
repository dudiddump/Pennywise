"use client";

import BudgetCard from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiEdit3 } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { budgetSchema } from "@/schemas/budgetSchema";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ChevronLeft, ChevronRight, CalendarDays, Wallet, DollarSign, PiggyBank } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define interfaces
interface Budget {
  _id: string;
  name: string;
  limit: number;
  spent: number;
}

interface BudgetCategoriesResponse {
  _id: string;
  categories: Budget[];
}

const PIE_CHART_COLORS = ['#34D399', '#3B82F6', '#8884d8', '#ffc658', '#00C49F', '#FFBB28'];

// CreateCard component
const CreateCard = ({ fetchUserBudgets }: { fetchUserBudgets: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { name: "", limit: 0 },
  });

  const onSubmit = async (data: z.infer<typeof budgetSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/budget/create-budget", data);
      toast({ title: "Success", description: response.data.message });
      if (response.data.success) {
        fetchUserBudgets();
        form.reset();
        setIsDialogOpen(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Create Budget Failed",
        description: axiosError.response?.data.message || "There was a problem creating your budget.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="w-[250px] h-[180px] m-5 flex justify-center items-center cursor-pointer border-dashed border-2 border-gray-600 text-gray-400 bg-white/5 hover:border-teal-400 hover:text-teal-400 transition-colors duration-200 rounded-lg">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <span className="text-4xl">+</span>
            <span className="text-lg font-bold mt-2">Create New Budget</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-[#0F2334] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-400">Create New Budget</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a new category and limit for your expenses.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <Input {...field} placeholder="e.g., Groceries, Transport" className="bg-white/5 border-gray-600 focus:border-teal-400" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="limit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit</FormLabel>
                  <Input {...field} type="number" placeholder="e.g., 500" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-white/5 border-gray-600 focus:border-teal-400" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white font-semibold">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const MyBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoriesResponse | null>(null);
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLimit, setNewLimit] = useState<number | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const totalBudgetLimit = budgetCategories?.categories?.reduce((sum, budget) => sum + budget.limit, 0) || 0;
  const totalSpent = budgetCategories?.categories?.reduce((sum, budget) => sum + budget.spent, 0) || 0;
  const totalRemaining = totalBudgetLimit - totalSpent;

  const pieChartData = budgetCategories?.categories?.map(budget => ({ name: budget.name, value: budget.limit })) || [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const fetchUserBudgets = useCallback(async () => { /* ... implementasi ... */ }, []);
  useEffect(() => { if (session) fetchUserBudgets(); }, [session, fetchUserBudgets]);
  const handleDeleteCategory = async (budgetId: string, categoryName: string) => { /* ... implementasi ... */ };
  const handleResetCategory = async (category: string, currentLimit: number) => { /* ... implementasi ... */ };

  return (
    <div className="p-6 w-full font-poppins">
      <div className="bg-gradient-to-r from-[#34D399]/20 to-[#3B82F6]/20 text-white p-6 md:p-8 rounded-xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="text-white hover:bg-white/20">
              <ChevronLeft size={28} />
            </Button>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
              <CalendarDays size={36} />
              {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </h1>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="text-white hover:bg-white/20">
              <ChevronRight size={28} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 p-5 rounded-xl">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2"><Wallet size={20} /> Total Budget</p>
              <p className="text-3xl font-extrabold">${totalBudgetLimit.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 p-5 rounded-xl">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2"><DollarSign size={20} /> Total Spent</p>
              <p className="text-3xl font-extrabold">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 p-5 rounded-xl">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2"><PiggyBank size={20} /> Remaining</p>
              <p className={`text-3xl font-extrabold ${totalRemaining < 0 ? 'text-red-400' : 'text-green-400'}`}>${totalRemaining.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 mt-10 text-center lg:text-left text-gray-100">Your Budget Categories</h2>
        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
          <CreateCard fetchUserBudgets={fetchUserBudgets} />
        </div>

        {Array.isArray(budgetCategories?.categories) && budgetCategories.categories.length > 0 && (
          <Card className="mt-12 p-6 shadow-2xl rounded-xl bg-white/5 border border-white/10">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-100">Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80 w-full p-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={5} fill="#8884d8" dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(9,28,45,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <h2 className="text-3xl font-bold mb-6 mt-12 text-center lg:text-left text-gray-100">Detailed Budget Overview</h2>
        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg border border-white/10 bg-white/5">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-white/10">
              <tr>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Spent</th>
                <th scope="col" className="px-6 py-3">Limit</th>
                <th scope="col" className="px-6 py-3">Edit</th>
                <th scope="col" className="px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBudget;

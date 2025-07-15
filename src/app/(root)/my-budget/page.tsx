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
import { Loader, Loader2, ChevronLeft, ChevronRight, CalendarDays, Wallet, DollarSign, PiggyBank } from "lucide-react"; // Added Wallet, DollarSign, PiggyBank icons
import { User } from "next-auth";
import { useSession } from "next-auth/react"; // FIX: Corrected import syntax
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

// Import Recharts components for charts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define interfaces for better type safety
interface Budget {
  _id: string;
  name: string;
  limit: number;
  spent: number;
  // Add other properties if they exist
}

interface BudgetCategoriesResponse {
  _id: string; // Assuming an ID for the overall budget collection
  categories: Budget[];
  // Add other properties if they exist
}

// Colors for the Pie Chart slices - Enhanced Palette
const PIE_CHART_COLORS = [
  '#8884d8', // Indigo
  '#82ca9d', // Green
  '#ffc658', // Yellow
  '#ff7300', // Orange
  '#00C49F', // Teal
  '#FFBB28', // Gold
  '#FF8042', // Coral
  '#0088FE', // Blue
  '#B065E6', // Light Purple
  '#66D9EF', // Light Blue
  '#A6E22E', // Lime Green
  '#FD971F', // Dark Orange
];

// CreateCard component (reverted to original structure, but with enhanced styling)
const CreateCard = ({ fetchUserBudgets }: { fetchUserBudgets: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog open/close

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: "",
      limit: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof budgetSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/budget/create-budget",
        data
      );

      toast({
        title: "Success",
        description: response.data.message,
      });

      if (response.data.success) {
        fetchUserBudgets();
        form.reset(); // Reset form fields after successful creation
        setIsDialogOpen(false); // Close dialog on success
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during budget creation:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message || "There was a problem creating your budget. Please try again.";

      toast({
        title: "Create Budget Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* The Card itself is the trigger now */}
        <Card className="w-[250px] h-[180px] m-5 flex justify-center items-center cursor-pointer border-dashed border-2 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <Image
              src="/icons/plus.svg" // Ensure this path is correct and the SVG exists
              alt="Create New Budget"
              width={30}
              height={30}
              className="w-12 h-8 mx-auto mb-2"
            />
            <span className="text-lg font-bold">Create New Budget</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-[350px] sm:w-[450px] md:w-[600px] rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Create New Budget</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            By creating a new budget, you're setting a new category for your expenses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Budget Name</FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Food, Education, Transport"
                      name="name"
                      className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="limit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Budget amount</FormLabel>
                    <Input
                      {...field}
                      name="limit"
                      type="number"
                      placeholder="e.g., 500"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create Budget"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MyBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoriesResponse | null>(null);
  const { data: session } = useSession();
  const user: User = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLimit, setNewLimit] = useState<number | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // State for current month/year navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate total budget, spent, and remaining
  const totalBudgetLimit = budgetCategories?.categories?.reduce((sum, budget) => sum + budget.limit, 0) || 0;
  const totalSpent = budgetCategories?.categories?.reduce((sum, budget) => sum + budget.spent, 0) || 0;
  const totalRemaining = totalBudgetLimit - totalSpent;

  // Data for the Pie Chart
  const pieChartData = budgetCategories?.categories?.map(budget => ({
    name: budget.name,
    value: budget.limit, // Using limit for distribution
  })) || [];

  // Function to navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
    // You might want to refetch budgets based on the new month here
    // For now, we'll assume budgets are general and not month-specific unless backend supports it
    // If backend supports month-specific budgets, pass currentDate to fetchUserBudgets
  };

  const fetchUserBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/budget/get-budget");
      if (response.data.success) {
        setBudgetCategories(response.data.data as BudgetCategoriesResponse);
      } else {
        console.log(response.data.message);
        setBudgetCategories(null); // Clear categories on error/no success
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ??
        "Error while fetching user budgets.";
      toast({
        title: "Fetch Budgets Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setBudgetCategories(null); // Clear categories on error
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session) {
      fetchUserBudgets();
    }
  }, [session, fetchUserBudgets]);

  const handleDeleteCategory = async (
    budgetId: string,
    categoryName: string
  ) => {
    try {
      const response = await axios.delete(
        `/api/budget/delete-budget/${budgetId}?name=${categoryName}`
      );
      if (response.data.success) {
        toast({
          title: "Category Deleted",
          description: response.data.message,
          variant: "default",
        });
        fetchUserBudgets(); // Refresh the budget categories after deletion
      } else {
        toast({
          title: "Error Deleting Category",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting.",
        variant: "destructive",
      });
    }
  };

  const handleResetCategory = async (category: string, currentLimit: number) => {
    setIsSubmitting(true);
    // Use newLimit if set, otherwise use the current budget's limit as default
    const limitToUse = newLimit !== null ? newLimit : currentLimit;

    try {
      const response = await axios.put<ApiResponse>(
        "/api/budget/reset-budget",
        {
          category,
          limit: limitToUse, // Pass the updated limit
        }
      );

      toast({
        title: response.data.success ? "Category Reset" : "Error",
        description: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });

      if (response.data.success) {
        fetchUserBudgets(); // Refresh budget data
      }

      setIsSubmitting(false);
      setNewLimit(null); // Clear newLimit state after reset
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "Error resetting category";

      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col pb-10 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      {/* Overview Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 md:p-8 lg:p-10 rounded-b-xl shadow-2xl mb-8 relative overflow-hidden">
        {/* Optional: Add a subtle background pattern */}
        {/* <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10 z-0"></div> */}
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="text-white hover:bg-white/20 transition-colors duration-200"
            >
              <ChevronLeft size={28} />
            </Button>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-md">
              <CalendarDays size={36} className="text-white/90" />
              {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="text-white hover:bg-white/20 transition-colors duration-200"
            >
              <ChevronRight size={28} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/15 p-5 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2">
                <Wallet size={20} /> Total Budget
              </p>
              <p className="text-3xl font-extrabold">${totalBudgetLimit.toFixed(2)}</p>
            </div>
            <div className="bg-white/15 p-5 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2">
                <DollarSign size={20} /> Total Spent
              </p>
              <p className="text-3xl font-extrabold">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white/15 p-5 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
              <p className="text-sm opacity-80 flex items-center justify-center gap-2 mb-2">
                <PiggyBank size={20} /> Remaining
              </p>
              <p className={`text-3xl font-extrabold ${totalRemaining < 0 ? 'text-red-300' : 'text-green-300'}`}>
                ${totalRemaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Budget Cards Section */}
        <h2 className="text-3xl font-bold mb-6 mt-10 text-center lg:text-left text-gray-800 dark:text-gray-100">Your Budget Categories</h2>
        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
          {/* Re-added CreateCard here */}
          <CreateCard fetchUserBudgets={fetchUserBudgets} />
          {loading && (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading Budgets...</span>
            </div>
          )}
          {/* FIX: Changed conditional rendering to use Array.isArray */}
          {!loading && Array.isArray(budgetCategories?.categories) && budgetCategories.categories.length === 0 && (
            <div className="w-full text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner text-gray-500 dark:text-gray-400">
              <p className="text-xl font-semibold">No Budget Categories available yet.</p>
              <p className="text-lg mt-3">Click the "Create New Budget" card to get started!</p>
            </div>
          )}
          {/* FIX: Changed conditional rendering to use Array.isArray */}
          {!loading && Array.isArray(budgetCategories?.categories) && budgetCategories.categories.length > 0 && budgetCategories.categories.map((budget: Budget) => (
            <BudgetCard key={budget._id} budget={budget} />
          ))}
        </div>

        {/* Budget Distribution Chart */}
        {/* FIX: Changed conditional rendering to use Array.isArray */}
        {Array.isArray(budgetCategories?.categories) && budgetCategories.categories.length > 0 && (
          <Card className="mt-12 p-6 shadow-2xl rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80 w-full p-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100} // Slightly larger radius
                    innerRadius={60} // Donut chart effect
                    paddingAngle={5} // Space between slices
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}


        {/* Budget Table Section */}
        <h2 className="text-3xl font-bold mb-6 mt-12 text-center lg:text-left text-gray-800 dark:text-gray-100">Detailed Budget Overview</h2>
        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Spent</th>
                <th scope="col" className="px-6 py-3">Limit</th>
                <th scope="col" className="px-6 py-3">Edit</th>
                <th scope="col" className="px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                    <span className="mt-2 block text-lg text-gray-600 dark:text-gray-400">Loading budget details...</span>
                  </td>
                </tr>
              ) : (Array.isArray(budgetCategories?.categories) && budgetCategories.categories.length > 0) ? ( // FIX: Changed conditional rendering to use Array.isArray
                budgetCategories.categories.map((budget: Budget) => (
                  <tr
                    key={budget._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{budget.name}</td>
                    <td className="px-6 py-4">${budget.spent.toFixed(2)}</td>
                    <td className="px-6 py-4">${budget.limit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-blue-500">
                      <Dialog>
                        <DialogTrigger asChild>
                          <FiEdit3 className="cursor-pointer hover:text-blue-700 transition-transform transform hover:scale-110" size={20} />
                        </DialogTrigger>
                        <DialogContent className="w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Reset Budget Details</DialogTitle>
                            <DialogDescription>
                              By clicking the reset button, this budget category will be reset, and previous data will be cleared.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <p className="mb-2"><b>Budget Category : </b> <span className="font-semibold">{budget.name}</span></p>
                              <p className="mb-2"><b>Budget Spent : </b> <span className="font-semibold">${budget.spent.toFixed(2)}</span></p>
                              <p><b>Budget Limit : </b> <span className="font-semibold">${budget.limit.toFixed(2)}</span></p>
                            </div>
                            <div className="w-full flex items-center gap-5">
                              <Label htmlFor="amount" className="text-right flex-shrink-0 text-gray-700 dark:text-gray-300">
                                New Budget Amount :
                              </Label>
                              <Input
                                type="number"
                                defaultValue={budget.limit}
                                onChange={(e) => setNewLimit(Number(e.target.value))}
                                className="flex-grow bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                          <DialogFooter className="pt-4">
                            <Button
                              onClick={() => handleResetCategory(budget.name, budget.limit)}
                              disabled={isSubmitting}
                              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Resetting...
                                </>
                              ) : (
                                "Reset Category"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="px-6 py-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <RiDeleteBin6Line
                            className="text-red-500 cursor-pointer hover:text-red-700 transition-transform transform hover:scale-110"
                            size={20}
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                              This action cannot be undone. This will permanently delete this budget category and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="pt-4">
                            <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 rounded-lg transition-colors duration-200">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteCategory(
                                  budgetCategories?._id || '',
                                  budget.name
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-10 py-10 text-center text-gray-500 dark:text-gray-400 text-lg"
                  >
                    No Budget Category available. Create new Budget category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBudget;

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
// Assuming these are your chart components
// import CustomLineChart from "@/components/chart/CustomLineChart";
// import LatestExpenseTable from "@/components/LatestExpenseTable";

// --- Type Definitions for API Data ---
interface DashboardData {
  totalExpenses: number;
  totalItems: number;
  savings: number; // Assuming this is total income
}

interface SavingGoalData {
  goalAmount: number;
  currentSave: number;
}

interface Category {
  _id: string;
  name: string;
  spent: number;
  limit: number;
}

interface BudgetData {
  categories: Category[];
}

// Helper component for stat cards with the new dark theme
const StatCard = ({ title, amount, description }: { title: string, amount: number, description: string }) => (
    <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-lg">
        <CardHeader>
            <CardDescription className="text-gray-400">{title}</CardDescription>
            <CardTitle className="text-3xl font-bold">
                ${(amount || 0).toLocaleString()}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
    </Card>
);

const Dashboard = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  const [dashboardData, setDashBoardData] = useState<DashboardData | null>(null);
  const [saveData, setSaveData] = useState<SavingGoalData | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<BudgetData | null>(null);
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRest, setLoadingReset] = useState<boolean>(false);
  const [range, setRange] = useState<string>("last 30 days");
  const { toast } = useToast();
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<DashboardData>>("/api/dashboard-data");
      if (response.data.success && response.data.data) {
        setDashBoardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []);

  const fetchSavingGoal = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<SavingGoalData>>("/api/save/get-goal");
      if (response.data.success && response.data.data) {
        setSaveData(response.data.data);
        if(response.data.data.goalAmount) {
          setGoalAmount(response.data.data.goalAmount);
        }
      }
    } catch (error) {
      console.error("Error fetching saving goal:", error);
    }
  }, []);

  const fetchUserBudgets = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<BudgetData>>("/api/budget/get-budget");
      if (response.data.success && response.data.data) {
        setBudgetCategories(response.data.data);
      }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message ?? "Error while fetching user budgets";
        toast({ description: errorMessage, variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
      fetchSavingGoal();
      fetchUserBudgets();
    }
  }, [session, fetchDashboardData, fetchSavingGoal, fetchUserBudgets]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalAmount(Number(e.target.value));
  };

  const handleSaveGoal = async () => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/save/create-goals", { goalAmount });
      toast({
        title: response.data.success ? "Success" : "Failed",
        description: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });
      if (response.data.success) fetchSavingGoal();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to save goal.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetGoal = async () => {
    setLoadingReset(true);
    try {
      const response = await axios.put<ApiResponse>("/api/save/reset-goal", { goalAmount: 0 });
      toast({
        title: response.data.success ? "Success" : "Failed",
        description: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });
      if (response.data.success) {
        setGoalAmount(0);
        fetchSavingGoal();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to reset goal.",
        variant: "destructive",
      });
    } finally {
      setLoadingReset(false);
    }
  };

  const progressValue =
    saveData?.goalAmount && saveData.goalAmount > 0
      ? ((saveData?.currentSave || 0) / saveData.goalAmount) * 100
      : 0;

  return (
    <div className="bg-[#091C2D] text-white min-h-screen p-4 sm:p-6 lg:p-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Hello, {user?.username || "Guest"} 👋
                </h1>
                <p className="text-gray-400 mt-1">Welcome back and see your progress!</p>
            </div>
            <Button className="bg-[#34D399] hover:bg-[#2cb985] text-[#0D1117] font-bold py-3 px-6 rounded-lg mt-4 sm:mt-0 flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                <FaPlus />
                Add Transaction
            </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Income" amount={dashboardData?.savings || 0} description="All time income" />
                    <StatCard title="Total Expense" amount={dashboardData?.totalExpenses || 0} description="All time expense" />
                    <StatCard title="Balance" amount={(dashboardData?.savings || 0) - (dashboardData?.totalExpenses || 0)} description="Current balance" />
                </div>
                
                {/* Placeholder for Transaction Chart and Table */}
                <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-lg h-96 flex items-center justify-center">
                    <CardContent className="text-center">
                        <CardTitle>Transaction Chart</CardTitle>
                        <CardDescription className="text-gray-400">Chart component will be here.</CardDescription>
                        {/* <CustomLineChart range={range} /> */}
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-lg h-96 flex items-center justify-center">
                    <CardContent className="text-center">
                        <CardTitle>Latest Expenses</CardTitle>
                        <CardDescription className="text-gray-400">Table component will be here.</CardDescription>
                        {/* <LatestExpenseTable /> */}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Savings Goal</CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="text-[#34D399] font-bold hover:bg-white/10">
                                        {saveData?.goalAmount && saveData.goalAmount > 0 ? "Edit Goal" : "Set Goal"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-[#0F2334] border-gray-700 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Saving Goal</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Set or update your saving goal.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Label htmlFor="goalAmount">Goal Amount</Label>
                                        <Input
                                            id="goalAmount"
                                            type="number"
                                            value={goalAmount}
                                            onChange={handleGoalChange}
                                            placeholder="$1000"
                                            className="bg-white/5 border-gray-600 focus:border-[#34D399]"
                                        />
                                    </div>
                                    <DialogFooter className="gap-2">
                                        {saveData?.goalAmount && saveData.goalAmount > 0 && (
                                            <Button onClick={handleResetGoal} variant="outline" disabled={loadingRest} className="border-gray-600 hover:bg-white/10">
                                                {loadingRest ? "Resetting..." : "Reset"}
                                            </Button>
                                        )}
                                        <Button onClick={handleSaveGoal} disabled={loading} className="bg-[#34D399] hover:bg-[#2cb985] text-[#0D1117]">
                                            {loading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-2xl font-bold">${(saveData?.currentSave || 0).toFixed(2)}</span>
                            <span className="text-sm text-gray-400">of ${(saveData?.goalAmount || 0).toFixed(2)}</span>
                        </div>
                        <Progress value={progressValue} className="h-2.5 bg-white/10 [&>div]:bg-[#34D399]" />
                        <p className="text-right text-sm text-gray-400 mt-1">{progressValue.toFixed(0)}% Reached</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-lg">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Budgets</CardTitle>
                        <Button variant="ghost" onClick={() => router.push("/my-budget")} className="text-[#34D399] font-bold hover:bg-white/10">
                            See All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {budgetCategories?.categories && budgetCategories.categories.length > 0 ? (
                                budgetCategories.categories.slice(0, 4).map((budget: Category) => {
                                    const budgetProgress = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                                    return (
                                        <div key={budget._id}>
                                            <div className="flex justify-between mb-1">
                                                <span className="font-medium">{budget.name}</span>
                                                <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                                            </div>
                                            <Progress value={budgetProgress} className="h-2 bg-white/10 [&>div]:bg-[#34D399]" />
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-gray-400 py-4">No budgets created yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

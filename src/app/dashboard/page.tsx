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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaPiggyBank, FaArrowDown, FaArrowUp } from "react-icons/fa";

import CustomCard from "@/components/CustomCard";
import LatestExpensesTable from "@/components/LatestExpenseTable";

interface DashboardData {
  totalExpenses: number;
  totalItems: number;
  savings: number;
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

// Komponen Utama Dashboard
const Dashboard = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  const [dashboardData, setDashBoardData] = useState<DashboardData | null>(null);
  const [saveData, setSaveData] = useState<SavingGoalData | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<BudgetData | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // State untuk filter waktu chart
  const [chartTimeFrame, setChartTimeFrame] = useState('last 30 days');

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
      toast({
        description: axiosError.response?.data.message ?? "Error fetching budgets",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
      fetchSavingGoal();
      fetchUserBudgets();
    }
  }, [session, fetchDashboardData, fetchSavingGoal, fetchUserBudgets]);

  const progressValue =
    saveData?.goalAmount && saveData.goalAmount > 0
      ? ((saveData?.currentSave || 0) / saveData.goalAmount) * 100
      : 0;

  return (
    <div className="p-6 w-full font-poppins">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#34D399] to-[#3B82F6] bg-clip-text text-transparent">
              Hello, {user?.username || "Guest"}
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome back and see your progress!
            </p>
          </div>
          <Button className="bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white font-bold py-3 px-6 rounded-lg mt-4 sm:mt-0 flex items-center gap-2 shadow-lg hover:shadow-[#34D399]/50 hover:scale-105 transition-all duration-300">
            <FaPlus />
            Add Transaction
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomCard
                title="Total Income"
                initialAmount={dashboardData?.savings || 0}
                icon={<FaArrowUp />}
              />
              <CustomCard
                title="Total Expense"
                initialAmount={dashboardData?.totalExpenses || 0}
                icon={<FaArrowDown />}
              />
              <CustomCard
                title="Balance"
                initialAmount={(dashboardData?.savings || 0) - (dashboardData?.totalExpenses || 0)}
                icon={<FaPiggyBank />}
              />
            </div>

            <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-xl hover:shadow-[#3B82F6]/30 transition">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-bold">Transaction Chart</CardTitle>
                <Select onValueChange={setChartTimeFrame} defaultValue={chartTimeFrame}>
                  <SelectTrigger className="w-[180px] bg-transparent border-white/20">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F2334] text-white border-white/20">
                    <SelectItem value="last 7 days">Last 7 days</SelectItem>
                    <SelectItem value="last 30 days">Last 30 days</SelectItem>
                    <SelectItem value="last year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="text-center h-80 flex items-center justify-center">
                <CardDescription className="text-gray-400 mt-2">
                  Chart component will be here.
                </CardDescription>
              </CardContent>
            </Card>

            <LatestExpensesTable />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-xl p-4">
              <CardHeader>
                <CardTitle className="text-xl">Savings Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-bold">
                    ${(saveData?.currentSave || 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    of ${(saveData?.goalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={progressValue}
                  className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-[#34D399] [&>div]:to-[#3B82F6] shadow-[0_0_10px_#34D399]"
                />
                <p className="text-right text-sm text-gray-400 mt-1">
                  {progressValue.toFixed(0)}% Reached
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-xl p-4">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Budgets</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/my-budget")}
                  className="text-[#34D399] font-bold hover:bg-white/10"
                >
                  See All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetCategories?.categories && budgetCategories.categories.length > 0 ? (
                    budgetCategories.categories.slice(0, 4).map((budget: Category) => {
                      const budgetProgress =
                        budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                      return (
                        <div key={budget._id}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{budget.name}</span>
                            <span className="text-sm text-gray-400">
                              ${budget.spent} / ${budget.limit}
                            </span>
                          </div>
                          <Progress
                            value={budgetProgress}
                            className="h-2 bg-white/10 [&>div]:bg-[#34D399] shadow-[0_0_6px_#34D399]"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-400 py-4">
                      No budgets created yet.
                    </p>
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

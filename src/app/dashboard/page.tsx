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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPiggyBank, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MessageCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

// --- DUMMY DATA ---
const dummyDashboardData = {
  totalExpenses: 1250.75,
  totalStocks: 15,
  savings: 5500.50,
};

const dummySavingGoalData = {
  goalAmount: 10000,
  currentSave: 4500,
  targetDate: "2025-12-31",
};

const dummyBudgetData = {
  categories: [
    { _id: "1", name: "Groceries", spent: 250.50, limit: 400 },
    { _id: "2", name: "Transport", spent: 80.00, limit: 150 },
    { _id: "3", name: "Entertainment", spent: 120.00, limit: 200 },
    { _id: "4", name: "Utilities", spent: 150.00, limit: 175 },
  ],
};

const dummyExpensesData = [
    { _id: "e1", date: "2025-08-26", category: "Food", amount: 25.50 },
    { _id: "e2", date: "2025-08-25", category: "Transport", amount: 15.00 },
    { _id: "e3", date: "2025-08-24", category: "Shopping", amount: 120.75 },
];

const dummyChartData = [
    { name: 'Jan', expenses: 400, savings: 240 },
    { name: 'Feb', expenses: 300, savings: 139 },
    { name: 'Mar', expenses: 200, savings: 980 },
    { name: 'Apr', expenses: 278, savings: 390 },
    { name: 'May', expenses: 189, savings: 480 },
    { name: 'Jun', expenses: 239, savings: 380 },
];

// --- Komponen-komponen Kecil ---

const SummaryCard = ({ title, amount, subtitle }: { title: string, amount: number | string, subtitle: string }) => (
    <div className="relative p-[1.5px] bg-gradient-to-b from-teal-400/50 to-transparent rounded-2xl h-full">
        <div className="bg-[#1C2A3A] rounded-[15px] h-full flex flex-col justify-center items-center text-center p-4">
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-4xl font-bold my-1 text-white">
                {typeof amount === 'string' ? amount : `$${(amount || 0).toLocaleString()}`}
            </p>
            <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
    </div>
);

const CustomBarChart = ({ dataKey, colors }: { dataKey: 'expenses' | 'savings'; colors: [string, string] }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dummyChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{
                    backgroundColor: "#0F2334",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "#fff"
                }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {dummyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? colors[0] : colors[1]} />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
);

const LatestExpensesTable = () => {
    const router = useRouter();
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
    return (
      <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold">Recent Expenses</CardTitle>
            <Button variant="ghost" onClick={() => router.push('/my-expenses')} className="text-[#34D399] font-bold hover:bg-white/10">See All</Button>
        </CardHeader>
        <CardContent>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-white/10">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyExpensesData.map((expense) => (
                            <tr key={expense._id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="px-6 py-4">{formatDate(expense.date)}</td>
                                <td className="px-6 py-4">{expense.category}</td>
                                <td className="px-6 py-4 text-right">${expense.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    );
};

// --- Komponen Utama Dashboard ---
const Dashboard = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();
  
  const [chartTimeFrame, setChartTimeFrame] = useState('last 30 days');
  const [summaryTimeFrame, setSummaryTimeFrame] = useState('all time');

  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState(dummySavingGoalData.goalAmount);
  const [newGoalDate, setNewGoalDate] = useState(dummySavingGoalData.targetDate);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  const progressValue = dummySavingGoalData.goalAmount > 0
      ? ((dummySavingGoalData.currentSave || 0) / dummySavingGoalData.goalAmount) * 100
      : 0;
  
  const getDaysRemaining = (targetDate?: string) => {
    if (!targetDate) return '';
    const diffDays = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Target passed';
    if (diffDays === 0) return 'Target today';
    return `${diffDays} days remaining`;
  };

  const handleSaveGoal = () => {
    setIsSubmittingGoal(true);
    console.log("Saving Goal:", { newGoalAmount, newGoalDate });
    // Di sini Anda akan memanggil API
    setTimeout(() => {
        setIsSubmittingGoal(false);
        setIsGoalDialogOpen(false);
    }, 1000);
  };

  const SavingsGoalCard = () => (
    <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-xl p-4">
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Savings Goal</CardTitle>
          {dummySavingGoalData.goalAmount > 0 && (
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-[#34D399] font-bold hover:bg-white/10 text-xs h-8">
                Edit Goal
              </Button>
            </DialogTrigger>
          )}
        </CardHeader>
        <CardContent>
          {dummySavingGoalData.goalAmount > 0 ? (
            <>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold">${(dummySavingGoalData.currentSave).toFixed(2)}</span>
                <span className="text-sm text-gray-400">of ${(dummySavingGoalData.goalAmount).toFixed(2)}</span>
              </div>
              <Progress value={progressValue} className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-[#34D399] [&>div]:to-[#3B82F6] shadow-[0_0_10px_#34D399]" />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{progressValue.toFixed(0)}% Reached</span>
                <span>{getDaysRemaining(dummySavingGoalData.targetDate)}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">No savings goal has been set.</p>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white font-bold">
                  Create Goals
                </Button>
              </DialogTrigger>
            </div>
          )}
        </CardContent>
        <DialogContent className="bg-[#0F2334] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Set Savings Goal</DialogTitle>
            <DialogDescription>Set a target amount and date for your savings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="goal-amount">Amount</Label>
                <Input id="goal-amount" type="number" value={newGoalAmount} onChange={(e) => setNewGoalAmount(Number(e.target.value))} className="bg-white/5 border-gray-600 focus:border-[#34D399]" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="goal-date">Target Date</Label>
                <Input id="goal-date" type="date" value={newGoalDate} onChange={(e) => setNewGoalDate(e.target.value)} className="bg-white/5 border-gray-600 focus:border-[#34D399]" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveGoal} disabled={isSubmittingGoal} className="bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white">
              {isSubmittingGoal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );

  const BudgetsCard = () => (
     <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-xl p-4">
        <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Budgets</CardTitle>
        <Button variant="ghost" onClick={() => router.push("/my-budget")} className="text-[#34D399] font-bold hover:bg-white/10">See All</Button>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
            {dummyBudgetData.categories.map((budget) => {
                const budgetProgress = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                return (
                <div key={budget._id}>
                    <div className="flex justify-between mb-1">
                    <span className="font-medium">{budget.name}</span>
                    <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                    </div>
                    <Progress value={budgetProgress} className="h-2 bg-white/10 [&>div]:bg-[#34D399] shadow-[0_0_6px_#34D399]" />
                </div>
                );
            })}
        </div>
        </CardContent>
    </Card>
  );

  const TransactionChartCard = () => (
    <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-xl p-4">
        <CardHeader className="flex flex-row justify-between items-center pb-4">
        <CardTitle className="text-2xl font-bold">Transaction Overview</CardTitle>
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
        <CardContent>
            <CustomBarChart dataKey="expenses" colors={['#8884d8', '#3B82F6']} />
        </CardContent>
    </Card>
  );

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
          <Button onClick={() => router.push('/my-feedback')} className="bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white font-bold py-3 px-6 rounded-lg mt-4 sm:mt-0 flex items-center gap-2 shadow-lg hover:shadow-[#34D399]/50 hover:scale-105 transition-all duration-300">
            <MessageCircle size={20} />
            Get AI Feedback
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
                <div className="flex justify-end mb-2">
                    <Select onValueChange={setSummaryTimeFrame} defaultValue={summaryTimeFrame}>
                        <SelectTrigger className="w-[150px] bg-[#1C2A3A] border-teal-400/50 text-white rounded-lg">
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F2334] text-white border-white/20">
                            <SelectItem value="all time">All Time</SelectItem>
                            <SelectItem value="last 7 days">Last 7 days</SelectItem>
                            <SelectItem value="last 30 days">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <SummaryCard
                        title="Expenses incurred"
                        amount={dummyDashboardData.totalExpenses}
                        subtitle="Expenses"
                    />
                    <SummaryCard
                        title="Total Stocks"
                        amount={dummyDashboardData.totalStocks.toString()}
                        subtitle="Stocks"
                    />
                    <SummaryCard
                        title="Savings"
                        amount={dummyDashboardData.savings}
                        subtitle="Savings"
                    />
                </div>
            </div>
            
            <div className="lg:hidden flex flex-col gap-6">
                <SavingsGoalCard />
                <TransactionChartCard />
            </div>

            <div className="hidden lg:block">
                 <TransactionChartCard />
            </div>

            <LatestExpensesTable />
          </div>

          <div className="hidden lg:flex lg:flex-col lg:col-span-1 gap-6">
            <SavingsGoalCard />
            <BudgetsCard />
          </div>

           <div className="lg:hidden">
                <BudgetsCard />
           </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

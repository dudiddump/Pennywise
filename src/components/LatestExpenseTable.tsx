"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";

// Interface untuk tipe data Expense
interface Expense {
    _id: string;
    date: string;
    category: string;
    amount: number;
}

const LatestExpensesTable = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const router = useRouter();
  
    const fetchUserExpenses = useCallback(async () => {
      try {
        const response = await axios.get<ApiResponse<Expense[]>>("/api/expense/get-expenses", {
          params: { page: 1, limit: 5 },
        });
  
        if (response.data.success && Array.isArray(response.data.data)) {
          setExpenses(response.data.data);
        }
      } catch (error) {
        console.error("Error while fetching expenses details", error);
      }
    }, []);
  
    useEffect(() => {
      fetchUserExpenses();
    }, [fetchUserExpenses]);
  
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
    };
  
    return (
      <Card className="bg-white/5 border-white/10 rounded-2xl text-white shadow-xl hover:shadow-[#34D399]/30 transition">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold">Recent Expenses</CardTitle>
            <Button variant="ghost" onClick={() => router.push('/my-expenses')} className="text-[#34D399] font-bold hover:bg-white/10">
                See All
            </Button>
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
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr key={expense._id} className="border-b border-white/10 hover:bg-white/5">
                                    <td className="px-6 py-4">{formatDate(expense.date)}</td>
                                    <td className="px-6 py-4">{expense.category}</td>
                                    <td className="px-6 py-4 text-right">${expense.amount.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">
                                    No recent expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    );
};

export default LatestExpensesTable;

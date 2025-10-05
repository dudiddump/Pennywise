"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, X, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

const SubscriptionPopup = ({
  open,
  onOpenChange,
  onPay,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPay: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-transparent border-none p-0 max-w-sm overflow-visible">
      <div className="relative p-[1.5px] bg-gradient-to-b from-teal-400/50 to-transparent rounded-2xl">
        <div className="bg-[#1C2A3A] rounded-[15px] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">
              Subscription
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 pt-2">
              Pay to continue this feature
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 text-base"
              onClick={() => {
                onPay();
                onOpenChange(false);
              }}
            >
              PAY
            </Button>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onOpenChange(false)}
        className="absolute -top-3 -right-3 text-gray-400 hover:text-white bg-[#1C2A3A] rounded-full border border-teal-400/50 h-8 w-8"
      >
        <X size={20} />
      </Button>
    </DialogContent>
  </Dialog>
);

const AIFeedbackPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const [income, setIncome] = useState<{
    salary: number;
    savings: number;
    goal: number;
  } | null>(null);

  useEffect(() => {
    const fetchIncome = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`/api/income?email=${user.email}`);
        const data = await res.json();
        setIncome(data);
      } catch (err) {
        console.error("Failed to fetch income:", err);
      }
    };
    fetchIncome();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isSubscribed) {
      setIsPopupOpen(true);
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    setTimeout(() => {
      setFeedback(
        "Here is your personalized expense feedback based on the selected dates."
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#091C2D] text-white font-poppins p-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-500/30 to-transparent -z-0"></div>
      <main className="relative z-10 flex-grow overflow-y-auto">
        <div className="fixed bg-transparent backdrop-blur-md z-20 p-2">
          <button
            onClick={() => router.back()}
            className="fixed top-2 left-4 p-2 rounded-full text-white hover:text-gray-300 focus:outline-none z-50"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="text-center mt-20 mb-8">
          <h1 className="text-2xl font-bold">
            AI-Powered Personalized Expense Optimization
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            This feature analyzes users financial data and offers actionable
            insights to improve your budgeting strategies
          </p>
        </div>

        <Card className="bg-[#1C2A3A] border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
          <CardHeader className="p-0 text-center">
            <CardTitle className="text-xl">Get Feedback</CardTitle>
            <CardDescription className="text-gray-400">
              Get personalized expense feedback in one-click
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/5 border-gray-600 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border-gray-600 mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3"
              >
                {isLoading ? "Generating..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSubmitted && (
          <Card className="bg-[#1C2A3A] border border-white/10 rounded-2xl p-6 max-w-md mx-auto mt-6">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">
                Your Personalized Expense Feedback are here:
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4 text-gray-300">
              {isSubscribed && feedback ? (
                <>
                  <h4 className="font-semibold text-white">Income Overview:</h4>
                  {income ? (
                    <>
                      <p>Monthly Salary: ${income.salary}</p>
                      <p>Current Savings: ${income.savings}</p>
                      <p>Savings Goal: ${income.goal}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">Loading income data...</p>
                  )}
                  <br />
                  <h4 className="font-semibold text-white">Expense Analysis:</h4>
                  <p>{feedback}</p>
                </>
              ) : (
                <div className="text-center py-8 flex flex-col items-center justify-center blur-sm backdrop-blur-sm">
                  <Lock size={40} className="text-gray-500 mb-4" />
                  <h4 className="font-semibold text-white">
                    Subscribe to Unlock
                  </h4>
                  <p className="text-gray-400">
                    This feature is available for premium users.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <SubscriptionPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        onPay={() => setIsSubscribed(true)}
      />
    </div>
  );
};

export default AIFeedbackPage;

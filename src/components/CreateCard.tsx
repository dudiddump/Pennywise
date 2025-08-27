"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import React, { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";

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
            <Plus size={32} className="mb-2" />
            <span className="text-lg font-bold">Create New Budget</span>
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
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Name</FormLabel>
                <Input {...field} placeholder="e.g., Groceries, Transport" className="bg-white/5 border-gray-600 focus:border-teal-400" />
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="limit" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Limit</FormLabel>
                <Input {...field} type="number" placeholder="e.g., 500" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-white/5 border-gray-600 focus:border-teal-400" />
                <FormMessage />
              </FormItem>
            )} />
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

export default CreateCard;

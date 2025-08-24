"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

// Mengganti nama komponen menjadi CustomCard
const CustomCard = ({
  title,
  initialAmount,
  icon,
}: {
  title: string;
  initialAmount: number;
  icon: React.ReactNode;
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [selectedTime, setSelectedTime] = useState<string>("last 30 days");
  const [description, setDescription] = useState(`Last 30 days`);

  const fetchData = useCallback(
    async (timeFilter: string) => {
      try {
        const response = await axios.get<ApiResponse<number | { total: number }>>(
          `/api/dashboard-data/dashboard-inside?title=${title}&time=${timeFilter}`
        );
        if (response.data.success) {
            // Menyesuaikan dengan kemungkinan format data yang berbeda
            const dataValue = typeof response.data.data === 'number' ? response.data.data : response.data.data?.total;
            setAmount(dataValue ?? 0);
            setDescription(`In the ${timeFilter}`);
        } else {
          console.log(response.data.message);
          setAmount(0);
        }
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
        setAmount(0);
      }
    },
    [title]
  );

  useEffect(() => {
    fetchData(selectedTime);
  }, [selectedTime, fetchData]);

  // Update amount jika prop awal berubah (misalnya, saat data dashboard pertama kali dimuat)
  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  return (
    <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-lg flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardDescription className="text-gray-400">{title}</CardDescription>
          <CardTitle className="text-3xl font-bold mt-1">
            {title === "Items" ? (amount || 0).toLocaleString() : `$${(amount || 0).toLocaleString()}`}
          </CardTitle>
        </div>
        <div className="text-[#34D399] text-2xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 h-4">{description}</p>
        <Select onValueChange={setSelectedTime} defaultValue={selectedTime}>
          <SelectTrigger className="w-full mt-3 bg-transparent border-white/20 h-9">
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F2334] text-white border-white/20">
            <SelectGroup>
              <SelectLabel>Select Time</SelectLabel>
              {title !== "Savings" && <SelectItem value="last 7 days">Last 7 days</SelectItem>}
              <SelectItem value="last 30 days">Last 30 days</SelectItem>
              <SelectItem value="last month">Last month</SelectItem>
              <SelectItem value="last 6 months">Last 6 months</SelectItem>
              <SelectItem value="last year">Last year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CustomCard;

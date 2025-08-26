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
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

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
  const [selectedTime, setSelectedTime] = useState<string>("all time");
  const [description, setDescription] = useState("All time data");

  const fetchData = useCallback(
    async (timeFilter: string) => {
      if (timeFilter === "all time") {
        setAmount(initialAmount);
        setDescription("All time data");
        return;
      }
      try {
        const response = await axios.get<ApiResponse<number | { total: number }>>(
          `/api/dashboard-data/dashboard-inside?title=${title}&time=${timeFilter}`
        );
        if (response.data.success) {
            const dataValue = typeof response.data.data === 'number' ? response.data.data : response.data.data?.total;
            setAmount(dataValue ?? 0);
            setDescription(`In the ${timeFilter}`);
        } else {
          setAmount(0);
        }
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
        setAmount(0);
      }
    },
    [title, initialAmount]
  );

  useEffect(() => {
    fetchData(selectedTime);
  }, [selectedTime, fetchData]);

  useEffect(() => {
    if (selectedTime === 'all time') {
        setAmount(initialAmount);
    }
  }, [initialAmount, selectedTime]);

  return (
    <Card className="bg-gradient-to-br from-[#0F2334] to-[#1E3A5F] border border-white/10 rounded-2xl text-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Select onValueChange={setSelectedTime} defaultValue="all time">
          <SelectTrigger className="w-auto h-7 text-xs bg-transparent border-white/20 px-2 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F2334] text-white border-white/20">
            <SelectGroup>
              <SelectLabel>Select Time</SelectLabel>
              <SelectItem value="all time">All Time</SelectItem>
              <SelectItem value="last 7 days">Last 7 days</SelectItem>
              <SelectItem value="last 30 days">Last 30 days</SelectItem>
              <SelectItem value="last year">Last year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
            <div className="text-[#34D399] text-xl">{icon}</div>
            <div className="text-2xl font-bold">${(amount || 0).toLocaleString()}</div>
        </div>
        <p className="text-xs text-gray-500 mt-1 h-4">{description}</p>
      </CardContent>
    </Card>
  );
};

export default CustomCard;

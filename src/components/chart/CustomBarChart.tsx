"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

interface BarChartProps {
  range: string;
}

interface ChartData {
  name: string;
  expenses: number;
  savings: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip rounded-lg border border-white/20 bg-[#0F2334] p-3 text-sm text-white shadow-lg">
        <p className="label font-bold">{`${payload[0].payload.name}`}</p>
        <p className="text-[#82ca9d]">{`Expenses: $${payload[0].value}`}</p>
        <p className="text-[#8884d8]">{`Savings: $${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomBarChart: React.FC<BarChartProps> = ({ range }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchChartData = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<ChartData[]>>(`/api/dashboard-data/barChart-data?range=${range}`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setChartData(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching bar chart data:", error);
    }
  }, [range]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" stroke="#888" fontSize={12} />
        <YAxis stroke="#888" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" radius={[4, 4, 0, 0]} />
        <Bar dataKey="savings" fill="#8884d8" name="Savings" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;

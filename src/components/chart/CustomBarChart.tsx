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
  Cell
} from "recharts";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useTheme } from "next-themes";

interface BarChartProps {
  range: string;
}

interface ChartData {
  name: string;
  expenses: number;
  savings: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, theme }: any) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    return (
      <div className={`rounded-lg border ${isDark ? 'border-white/20 bg-[#0F2334]' : 'border-gray-300 bg-white'} p-3 text-sm shadow-lg`}>
        <p className={`label font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{`${payload[0].payload.name}`}</p>
        <p style={{ color: payload[0].fill }}>{`Expenses: $${payload[0].value}`}</p>
        <p style={{ color: payload[1].fill }}>{`Savings: $${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomBarChart: React.FC<BarChartProps> = ({ range }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { theme } = useTheme();

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

  const tickColor = theme === 'dark' ? '#888' : '#333';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} />
        <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
        <YAxis stroke={tickColor} fontSize={12} />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend wrapperStyle={{ color: tickColor }} />
        <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" radius={[4, 4, 0, 0]} />
        <Bar dataKey="savings" fill="#8884d8" name="Savings" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;

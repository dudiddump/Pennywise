"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  spent: number;
  limit: number;
}

const CustomBarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="w-full h-[300px] bg-[#0C1320]/80 p-4 rounded-2xl border border-white/10 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="name" stroke="#CBD5E1" />
          <YAxis stroke="#CBD5E1" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              color: "#fff",
            }}
          />
          <Bar dataKey="spent" fill="#34D399" radius={[6, 6, 0, 0]} />
          <Bar dataKey="limit" fill="#60A5FA" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;

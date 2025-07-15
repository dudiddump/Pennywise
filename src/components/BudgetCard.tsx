// components/BudgetCard.tsx
// This component displays an individual budget category with a progress bar and status.

import React from 'react';
import { Card, CardContent } from './ui/card'; // Ensure CardContent is imported

// Define the interface for a single budget item for better type safety
// This aligns with the 'Budget' interface used in page.tsx
interface Budget {
  _id: string; // Added _id for consistency with page.tsx
  name: string;
  limit: number;
  spent: number;
  // 'item?' was in your original, but not used. Keeping it out for simplicity
  // unless it's explicitly needed elsewhere.
}

interface BudgetCardProps {
  budget: Budget;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  // Calculate the percentage of the budget spent
  const percentageSpent = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

  // Determine the color of the progress bar based on the percentage spent
  let progressColorClass = "bg-green-500"; // Green for under budget
  if (percentageSpent > 75 && percentageSpent <= 100) {
    progressColorClass = "bg-yellow-500"; // Yellow for approaching limit (75-100%)
  } else if (percentageSpent > 100) {
    progressColorClass = "bg-red-500"; // Red for over budget (>100%)
  }

  return (
    <Card className="w-[250px] h-[180px] m-5 flex flex-col justify-between p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden relative">
      <CardContent className="flex-grow flex flex-col justify-center items-center p-0 text-center">
        {/* Budget Name */}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate max-w-full">
          {budget.name}
        </h3>
        {/* Spent vs. Limit */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Spent: <span className="font-medium">${budget.spent.toFixed(2)}</span> / Limit: <span className="font-medium">${budget.limit.toFixed(2)}</span>
        </p>
      </CardContent>

      {/* Progress Bar */}
      <div className="w-full mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          {/* The width of the inner div is dynamically set based on percentageSpent */}
          {/* Math.min(percentageSpent, 100) caps the visual bar at 100% even if over budget */}
          <div
            className={`h-2.5 rounded-full ${progressColorClass}`}
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          ></div>
        </div>
        {/* Display percentage and status */}
        <p className={`text-xs mt-1 text-right font-medium ${percentageSpent > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {percentageSpent.toFixed(0)}% used
          {percentageSpent > 100 && <span className="ml-1 font-bold"> (Over Budget!)</span>}
        </p>
      </div>
    </Card>
  );
}

export default BudgetCard;

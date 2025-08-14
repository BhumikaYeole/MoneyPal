"use client";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function AccountBarChart({ transactions }) {
  const Date_Ranges = {
    "7D": { label: "Last 7 days", days: 7 },
    "1M": { label: "last month", days: 30 },
    "3M": { label: "last 3 months", days: 60 },
    "6M": { label: "last 6 months", days: 120 },
    ALL: { label: "All Time", days: null },
  };
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = Date_Ranges[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date: date, income: 0, expense: 0 };
      }

      transaction.type !== "EXPENSE"
        ? (acc[date].income += transaction.amount)
        : (acc[date].expense += transaction.amount);

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [dateRange, transactions]);

  // console.log(filteredData);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),

      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // console.log(totals);

  return (
    <Card className="w-full max-w-[1350px] mx-auto">
  {/* Header */}
  <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <CardTitle className="text-lg sm:text-xl md:text-2xl">
      Transaction Overview
    </CardTitle>
    <Select defaultValue={dateRange} onValueChange={setDateRange}>
      <SelectTrigger className="w-[150px] sm:w-[180px] text-sm sm:text-base">
        <SelectValue placeholder="Select Range" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Date_Ranges).map(([key, { label }]) => (
          <SelectItem value={key} key={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </CardHeader>

  {/* Totals */}
  <CardContent>
    <div className="flex flex-wrap justify-around gap-4 mb-6 text-xs sm:text-sm">
      <div className="text-center flex-1 min-w-[100px]">
        <p className="text-muted-foreground">Total Income</p>
        <p className="text-base sm:text-lg font-bold text-green-500">
          ₹{totals.income.toFixed(2)}
        </p>
      </div>
      <div className="text-center flex-1 min-w-[100px]">
        <p className="text-muted-foreground">Total Expenses</p>
        <p className="text-base sm:text-lg font-bold text-red-500">
          ₹{totals.expense.toFixed(2)}
        </p>
      </div>
      <div className="text-center flex-1 min-w-[100px]">
        <p className="text-muted-foreground">Net</p>
        <p
          className={`text-base sm:text-lg font-bold ${
            totals.income - totals.expense >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          ₹{(totals.income - totals.expense).toFixed(2)}
        </p>
      </div>
    </div>

    {/* Chart */}
    <div className="h-[250px] sm:h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            fontSize={10}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            fontSize={10}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            formatter={(value) => [`₹${value.toFixed(2)}`, undefined]}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar
            dataKey="income"
            name="Income"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

  );
}

export default AccountBarChart;

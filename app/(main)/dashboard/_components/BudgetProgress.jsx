'use client'

import React, { useEffect } from 'react'
import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"
import { Check, Pencil, X } from 'lucide-react';
import { updateBudget } from '@/actions/budget';
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';

const BudgetProgress = ({ initialBudget, currentExpense }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount.toString() || '');

  // console.log(initialBudget , currentExpense)

  const percentUsed = initialBudget ? (currentExpense / initialBudget.amount) * 100 : 0;

  const { loading: budgetLoading,
    fn: updateBudgetFn,
    error,
    data: updatedBudget
  } = useFetch(updateBudget);

  async function handleUpdateBudget() {
    const amount = newBudget;

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter valid amount")
      return
    }

    await updateBudgetFn(amount);
  }

  useEffect(()=>{
    if(updatedBudget?.success)
    {
      setIsEditing(false)
      toast.success("Budget updated suuccessfully");
    }
  }, [updatedBudget])

  useEffect(()=>
  {
    if(error)
    {
      toast.error("Budget update failed")
    }
  }, [error])

  function handleCancel() {

    setNewBudget(initialBudget?.amount.toString() || "")
    setIsEditing(false)

  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Monthly Budget (Default account)</CardTitle>
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-40"
                placeholder="Enter amount"
                autoFocus />
              <Button variant="ghost"
                size="icon"
                onClick={handleUpdateBudget}
                disabled = {budgetLoading}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled = {budgetLoading}>
                <X className='h-4 w-4 text-red-500' />
              </Button>
            </div>
          ) :
            (
              <div className='flex'>
                <CardDescription>
                  {initialBudget ? `₹${currentExpense} of ₹${initialBudget.amount} spent` : `No Budget Set`}
                </CardDescription>
                <Button variant='ghost' size='icon' onClick={() => setIsEditing(true)} disabled = {budgetLoading}>
                  <Pencil />
                </Button>
              </div>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
              <Progress value={percentUsed} extraStyles={`${percentUsed >= 90 ? "bg-red-500"
                 : percentUsed >= 75 ? "bg-yellow-500 " 
                 : "bg-green-500"}`} />
              {`${percentUsed.toFixed(2)}% used ` }
        </div>
      </CardContent>
    </Card>
  )
}

export default BudgetProgress
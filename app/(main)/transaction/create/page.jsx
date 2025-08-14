

import { getAllAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/components/data/categories';
import React from 'react'
import AddTransactionForm from './_components/AddTransactionForm';
import { getTransaction } from '@/actions/transactions';

export default async function AddTransaction({ searchParams }) {
  const accounts = await getAllAccounts();
  let initialData = null

  const editId = searchParams?.edit
  console.log(!!editId);

  if(editId){
    const transaction = await getTransaction(editId) 
    initialData = transaction;
  }


  return (
    <div className='max-w-3xl mx-auto px-5'>
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl text-blue-500 ">Add Transaction</h1>
      </div>
      <div>
        <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId}  initialData={initialData} />
      </div>
    </div>
  )
}

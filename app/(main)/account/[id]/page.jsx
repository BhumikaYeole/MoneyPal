'use server'

import { getAccountWithTransactions } from '@/actions/accounts'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import TransactionTable from './_components/TransactionTable'
import AccountBarChart from './_components/AccountBarChart'



async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id)

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div>
      <div className="p-3 mt-6 md:mt-10 flex items-start justify-center">
  <div className="flex flex-col md:flex-row md:justify-between w-full max-w-7xl p-4 md:p-6 gap-6">
    <div>
      <h1 className="font-bold text-3xl md:text-5xl text-gradient mb-3">
        {account.name}
      </h1>
      <p className="text-base md:text-lg text-gray-700">
        <span className="font-bold">
          {account.type[0] + account.type.slice(1).toLowerCase()}
        </span>
        {' '}Account
      </p>
    </div>
    <div className="text-right">
      <p className="text-xl md:text-2xl font-semibold text-green-600 mb-1">
        ₹{parseFloat(account.balance).toFixed(2)}
      </p>
      <p className="text-sm md:text-md text-gray-600">
        {account._count.transactions} Transactions
      </p>
    </div>
  </div>
</div>

<div className="w-full max-w-7xl mx-auto p-4 md:p-6">
  <Suspense>
    <AccountBarChart transactions={transactions} className="w-full h-80" />
  </Suspense>
</div>

<div className="w-full max-w-7xl mx-auto p-4 md:p-6">
  <Suspense>
    <TransactionTable transactions={transactions} />
  </Suspense>
</div>

    </div>
  )
}

export default AccountPage;

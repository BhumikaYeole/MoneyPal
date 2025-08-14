import { getAllAccounts, getDashBoardData } from '@/actions/dashboard'
import CreateAccountDrawer from '@/components/create-account-drawer.jsx'
import React from 'react'
import AccountCard from './_components/AccountCard';
import getCurrentBudget from '@/actions/budget';
import BudgetProgress from './_components/BudgetProgress';
import DashboardOverview from './_components/DashboardOverview';

async function DashBoardPage() {
  const accounts = await getAllAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashBoardData()

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-4 w-full bg-gray-50 min-h-screen">

      <h1 className="text-3xl sm:text-5xl md:text-6xl text-blue-500 text-center tracking-tight">
        Dashboard
      </h1>

      {defaultAccount && (
        <div className="w-full max-w-8xl">
          <div className=" rounded-2xl p-4 sm:p-6">
            <BudgetProgress 
              initialBudget={budgetData?.budget}  
              currentExpense={budgetData?.currentExpense || 0} 
            />
          </div>
        </div>
      )}

      <DashboardOverview transactions={transactions || []} accounts={accounts}/>

      <CreateAccountDrawer>
        <div className="flex flex-col items-center justify-center h-[160px] w-full max-w-sm bg-white hover:bg-blue-50 text-lg font-semibold text-gray-700 rounded-2xl border-2 border-dashed border-blue-300 cursor-pointer transition-all shadow-sm hover:shadow-md">
          <p className="text-5xl text-blue-500">+</p>
          <span>Add New Account</span>
        </div>
      </CreateAccountDrawer>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="w-full">
              <AccountCard account={account} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full col-span-full">
            No accounts found.
          </p>
        )}
      </div>
    </div>
  );
}

export default DashBoardPage;

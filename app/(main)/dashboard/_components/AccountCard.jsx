"use client"

import { updateDefaultAccount } from '@/actions/accounts';
import {
    Card, CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {useEffect} from 'react'
import { toast } from 'sonner';

function AccountCard({ account }) {
    const { name, id, type, balance, isDefault } = account;

    const {data : updatedAccount,
           fn : updateDefaultAccountfn,
           loading : updateLoading,
           error
    } = useFetch(updateDefaultAccount)

async function handleUpdateChange(e) {
        e.preventDefault();
        console.log("clicked")
        if(isDefault)
            {
                toast.warning("Atleast one account must be Default")
                return 
            } 
        await updateDefaultAccountfn(id);
    }

    useEffect(() => {
       
        if(updatedAccount?.success){
            toast.success("Account set to default successfully")
        }
      
    }, [updateDefaultAccountfn,updateLoading])
    
    useEffect(() => {
       
        if(error) {
            toast.error(error.message  || "Failed to update default account");
        }
       
    }, [error])
    
    return (
       <div className=''>
        <Card className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-900 flex flex-col gap-2 w-full max-w-sm">
        <Link href={`/account/${id}`}>
            <div className="flex items-center justify-between">
                <CardHeader className="p-0">
                    <CardTitle className="text-md font-medium text-gray-800 dark:text-white">{name}</CardTitle>
                </CardHeader>
                <Switch checked={isDefault} onClick={handleUpdateChange}  disabled={updateLoading}

                />
            </div>

            <CardContent className="p-0 mt-2 text-xl text-gray-600 dark:text-gray-300">
                <p className="mb-1"><span className="font-bold text-black dark:text-white">{balance}</span></p>
                <p className='text-sm' > <span className="capitalize">{type[0] + type.slice(1).toLowerCase()}</span> account</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center pt-2 border-t mt-2">
                <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">Income</span>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                    <ArrowDownLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Expense</span>
                </div>
            </CardFooter>
        </Link>
        </Card>
       </div>

    )
}

export default AccountCard
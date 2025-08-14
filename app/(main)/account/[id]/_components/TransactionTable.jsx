'use client';

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/components/data/categories";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { bulkDeleteTransactions } from "@/actions/accounts";
import {BarLoader} from "react-spinners"
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

function TransactionTable({ transactions }) {

  const router = useRouter();


  const [selectedId, setSelectedId] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState("")
  const [recurringFilter, setRecurringFilter] = useState("");

  const {data : dataDeleted,
        loading : deleteLoading,
        error: deleteError,
        fn : deleteFn} = useFetch(bulkDeleteTransactions)
  
  useEffect(() => {
     
    if(dataDeleted && !deleteLoading){
      toast.error("Transaction(s) deleted sucessfully")
      
    }
  
  }, [dataDeleted,deleteLoading])
  

  

  const filteredandsortedTransactions = useMemo(() => {
    let result = [...transactions]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) => 
        transaction.description?.toLowerCase().includes(searchLower)   
      )
    }

    if(typeFilter)
    {
        typeFilter==="EXPENSE" ? (
        result = result.filter((transaction)=>
          transaction.type === "EXPENSE"
        )
      ):
      (
        result = result.filter((transaction)=>
          transaction.type !== "EXPENSE"
        )
      )    
    }

    if(recurringFilter)
    {
      recurringFilter === "recurring" ?
      (
        result = result.filter((transaction)=>transaction.isRecurring === true)
      ):
      (
        result = result.filter((transaction)=>transaction.isRecurring === false)
      )
    }

    let compare = 0;
    result.sort((a,b)=>
     {
      switch(sortConfig.field){
        case "date" :
          compare = new Date(a.date) - new Date(b.date)
          break;

        case "amount" :
          compare = a.amount - b.amount
          break;
        
        case "category" :
          compare = a.category.localeCompare(b.description)
          break ;

        default :
        compare = 0;
        break;
        
      }
       return sortConfig.direction === "asc" ? compare : -compare
     }
    )

    return result
  },
   [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);


  const recurringIntervals = {
    DAILY: "Daily",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    WEEKLY: "Weekly",
  }

  function handleSelect(id) {
    setSelectedId((current) => (
      current.includes(id) ? current.filter((item) => item != id) : [...current, id]
    ))
  }

  function handleSelectAll() {
    

    setSelectedId((current) => (
      current.length === filteredandsortedTransactions.length ? [] : filteredandsortedTransactions.map((transaction) => transaction.id)
    ))
  }
 

  function handleSort(field) {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  function handleEdit()
  {
    
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedId([]);
    setRecurringFilter("");
    setTypeFilter("")
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedId.length} transactions?`)) return;
   deleteFn(selectedId);
   setSelectedId([])
  };

  return (

    <>

     <div className="flex flex-col w-full max-w-[1350px] mx-auto sm:flex-row gap-4 px-2">
        {deleteLoading && <BarLoader width={"100%"} />}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedId.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedId.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>



      <div className="w-full overflow-x-auto px-2">
          <Table className="min-w-[700px] w-full max-w-[1350px] mx-auto border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={() => handleSelectAll()}
                  checked={selectedId.length === filteredandsortedTransactions.length && selectedId.length > 0}
                  className="border cursor-pointer border-black bg-blue-50" />
              </TableHead>
              <TableHead onClick={() => handleSort("date")}>
                <div className="flex flex-row">Date
                  {sortConfig.field === "date" && sortConfig.direction === "desc" ? <ChevronDown /> : <ChevronUp />}</div>
              </TableHead>
              <TableHead>
                <div>Description</div>
              </TableHead>
              <TableHead onClick={() => handleSort("category")} className=" md:table-cell">
                <div className="flex flex-row">Category
                  {sortConfig.field === "category" && sortConfig.direction === "desc" ? <ChevronDown /> : <ChevronUp />}</div>
              </TableHead>
              <TableHead className={"text-right pr-10"} onClick={() => handleSort("amount")}>
                <div className="flex flex-row justify-end">Amount
                  {sortConfig.field === "amount" && sortConfig.direction === "desc" ? <ChevronDown /> : <ChevronUp />}</div>
              </TableHead>
              <TableHead className="md:table-cell">Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredandsortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={7}>
                  No Transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredandsortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedId.includes(transaction.id)}
                      className="bg-blue-50 border border-black" />
                  </TableCell>
                  <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className=" md:table-cell">
                    <span style={
                      {
                        background: categoryColors[transaction.category],

                      }
                    } className="px-2 py-1 rounded text-white text-sm">
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className={"text-right pr-10"} style={{
                    color: transaction.type === "EXPENSE" ? "red" : "green"
                  }}
                  > {transaction.type === "EXPENSE" ? "-" : "+"} {" "}₹ {" "}
                    {transaction.amount.toFixed(2)}</TableCell>
                  <TableCell className="md:table-cell">
                    {transaction.isRecurring ?
                      (<Tooltip>
                        <TooltipTrigger>

                          <Badge variant="outline">
                            <RefreshCw />
                            {recurringIntervals[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>
                            <p>Next Date</p>
                            <p>{format(new Date(transaction.nextRecurringDate), "PP")}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>)
                      : (
                        <Badge variant="outline ">
                          <Clock /> One Time
                        </Badge>
                      )
                    }

                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">


                      <DropdownMenuItem
                          onClick={()=> router.push(`/transaction/create?edit=${transaction.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>

          </TableFooter>
        </Table>
      </div>
    </>
  );
}

export default TransactionTable;

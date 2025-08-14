import { serve } from "inngest/next"
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlerts, processRecurringTransaction, triggerRecurringTransaction } from "@/lib/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    triggerRecurringTransaction,
    processRecurringTransaction
    /* your functions will be passed here later! */
  ],
});
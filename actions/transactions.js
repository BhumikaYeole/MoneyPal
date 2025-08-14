"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { GoogleGenerativeAI } from "@google/generative-ai";

const serializedAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber()

})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function createTransaction(data) {
    try {
        // console.log(data)
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // rate limiting using arcjet

        const req = await request()

        const decision = await aj.protect(req, {
            userId,
            requested: 1,
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });
                throw new Error("Too may requests. Try again later", remaining)

            }
            throw new Error("Request Blocked")
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });


        if (!user) {
            throw new Error("User not found");
        }

        const account = await db.account.findUnique(
            {
                where: {
                    id: data.accountId,
                    userId: user.id,
                }
            }
        )


        if (!account) {
            throw new Error("Account not found");
        }
        //    console.log(data.accountId)

        //    console.log(user)
        //    console.log(account)

        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount
        const newBalance = account.balance.toNumber() + balanceChange
        //    console.log(newBalance)


        const transaction = await db.$transaction(async (tx) => {

            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.date, data.recurringInterval) : null
                }
            })

            await tx.account.update({
                where: {
                    id: data.accountId,
                },
                data: {
                    balance: newBalance
                }
            })

            return newTransaction
        })

        revalidatePath("/dashboard")
        revalidatePath(`/account/${transaction.accountId}`);


        return (
            { success: true, data: serializedAmount(transaction) }
        )

    } catch (error) {
        throw new Error(error.message)
    }
}

export async function updateTransaction(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true
            }

        })
        if (!originalTransaction) {
            throw new Error("Original transaction not found")
        }

        const oldBalance = originalTransaction.type === "EXPENSE" ? -originalTransaction.amount.toNumber() : originalTransaction.amount.toNumber()

        const newBalance = data.type === "EXPENSE" ? -data.amount : data.amount

        const netBalanceChange = newBalance - oldBalance

        const transaction = await db.$transaction(async(tx)=>{
            const updatedTransaction = await tx.transaction.update({
                where :{
                    id,
                    userId : user.id,
                },
                data : {
                    ...data,
                    nextRecurringDate : data.isRecurring && data.recurringInterval
                                        ? calculateNextRecurringDate(data.date, data.recurringInterval)
                                        : null,
                } 
            })

            await tx.account.update({
                where : {
                     id : data.accountId
                },
                data : {
                    balance : {
                        increment : netBalanceChange
                     }
                }
            })
            return updatedTransaction;
        })
        revalidatePath("/dashboard")
        revalidatePath(`/account/${data.accountId}`)

        return {
            success : true, data : serializedAmount(transaction)
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function getTransaction(id) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const transaction = await db.transaction.findUnique({
            where : {
                id,
                userId : user.id,
            }

        
        })

        if(!transaction) throw new Error("Transaction not found")

        return serializedAmount(transaction)
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function getAllTransactions(query ={}){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const transactions = await db.transactions.findMany({
            where :{
                userId : user.id,
                ...query,
            },
            include : {
                account : true,
            },
            orderBy : {
                date : "desc"
            }  
        })
            
        return {success : true , data : transactions}

    } catch (error) {
        throw new Error(error.message)
    }
}


function calculateNextRecurringDate(startDate, recurringInterval) {
    const date = new Date(startDate)

    switch (recurringInterval) {
        case "DAILY":
            date.setDate(date.getDate() + 1)
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7)
            break;

        case "MONTHLY":
            date.setMonth(date.getMonth() + 1)
            break;

        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1)
            break;
    }
    return date
}

export async function scanReceipt(file) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        // Convert ArrayBuffer to Base64
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: Housing,Tansportation,Groceries,Utilities,Entertainment,Food,Shopping,Healthcare,Education,Personal,Travel,Insurance,Gifts,Bills,Other expenses)
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);


        const response = await result.response;    // await is necessary here
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            };
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid response format from Gemini");
        }
    } catch (error) {
        console.error("Error scanning receipt:", error);
        throw new Error("Failed to scan receipt");
    }
}


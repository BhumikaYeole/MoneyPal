"use server"

import { Resend } from "resend";

export default async function sendEmail({to, subject, react})
{
    const resend = new Resend(process.env.RESEND_API_KEY || "")

    try {
        const email = await resend.emails.send({
            from : "MoneyPal <onboarding@resend.dev>",
            to,
            subject,
            react
        })

        return {success : true, data : email}
        
    } catch (error) {
        console.error("error sending email")
        return { success : false , data : error.message}
        
    }
}
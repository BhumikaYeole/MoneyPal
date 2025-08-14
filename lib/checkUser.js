import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma.js";

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId : user.id,
            },
        })
        if (loggedInUser) {
            return loggedInUser;
        }
        
        const name = `${user.firstName} ${user.lastName}`
        const newUser = await db.user.create({
            data : {
                clerkUserId : user.id,
                name : name,
                email : user.emailAddresses[0].emailAddress,
                imageUrl : user.imageUrl,
            }
        })
        return newUser;
    }
    catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
}
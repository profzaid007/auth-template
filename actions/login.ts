"use server";
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { RiExchangeBoxFill } from 'react-icons/ri';
import { sendVerificationEmail } from '@/lib/mail';


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);



    if(!existingUser){
        return {error: "Email Does not Exist"}
    }


    
    if(!existingUser.emailVerified && existingUser.email){
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return {success: "Confirmation Email Sent!"}
    }

    
   

   
   
   

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
}
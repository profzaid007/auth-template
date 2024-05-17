"use server";
import bcryptjs from 'bcryptjs';
import {db} from '@/lib/db'
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';

import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';

export const register = async(values:z.infer<typeof RegisterSchema> ) =>{
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid Fields!"};
    }
    
    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if(existingUser){
        return {error: "Email is already in use!"};
    }

    await db.user.create({
        data:{
            email,
            password:hashedPassword,
            name,
        },
    });


    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )

    return {success: "Confirmation email sent"};
}
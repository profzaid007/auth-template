"use server";
import bcryptjs from 'bcryptjs';
import {db} from '@/lib/db'
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
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
    //TODO SEND TOKEN MESSAGE

    return {success: "User Created Successfully"};
}
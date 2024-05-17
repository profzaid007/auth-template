import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {UserRole} from "@prisma/client";
import{db} from "@/lib/db";
import authConfig from "@/auth.config";
import {getUserById} from "@/data/user";
import { RiExchangeBoxFill } from "react-icons/ri";


// declare module "@auth/core"{
//   interface Session {
//     user: { 
//         role:"ADMIN" | "USER";
//     } & DefaultSession["user"];
//   }
// }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages:{
    signIn:"/auth/login",
    error:"/auth/error",
  },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified:new Date()}
      })
    }
  },
  callbacks: {
      
      async signIn({user, account}){
        //Allow oauth

        if(account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user.id);
        // prevent sign in verified without email verification
        if(!existingUser?.emailVerified) return false;

        //TODO add 2FA check
        return true;
      },
      async session({token,session}){
        
        if(session.user && token.sub){
        session.user.id = token.sub;
        }

        if(token.role && session.user){
          session.user.role = token.role as UserRole;
        }
        
        return session;
      },
      async jwt({token}){
        if(!token.sub) return token;
        const existingUser = await getUserById(token.sub);
        
        if(!existingUser) return token;

        token.role = existingUser.role;


        return token;
      }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt"},
  ...authConfig,
})



import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";

import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma_client";


export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'email'},
                password: { label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string; password: string };
            
                if (!email || !password) {
                    return null;
                }
            
                const user = await prisma.user.findFirst({
                    where: { user_email:email }
                });
            
                if (!user) {
                    return null;
                }
            
                const matched = await compare(password, user.user_password as string);
            
                if (!matched) {
                    return null;
                }
            
                return {
                    id: user.user_id,
                    email: user.user_email,
                    role: user.user_role
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account?.provider == "google") {
                token.id = profile?.sub!,
                token.email = profile?.email!,
                token.provider = "google"

                let existedUser = await prisma.user.findFirst({
                    where: { user_id: token.id as string }
                });

                if (!existedUser) {
                    existedUser = await prisma.user.create({
                        data: {
                            user_id: profile?.sub!,
                            user_email: profile?.email!,
                            provider: "google"
                        }
                    });
                }

            }
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            const dbUser = await prisma.user.findFirst({
                where: { user_id: token.id as string }
            });

    
            if (dbUser) {
                token.role = dbUser.user_role;
                token.email = dbUser.user_email;
            }
    
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            // Sync session with updated token data
            if (token) {
                session.user.id = token.id;
                // session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
            }
    
            return session;
        }
    },
    pages: {
        signIn: "/",
        error: "/"
    },
    secret: process.env.AUTH_SECRET
}
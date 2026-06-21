// import { betterAuth } from "better-auth";
// import { mongodbAdapter} from "better-auth/adapters/mongodb";
// import { connectToDatabase} from "@/database/mongoose";
// import { nextCookies} from "better-auth/next-js";
//
// let authInstance: ReturnType<typeof betterAuth> | null = null;
//
// export const getAuth = async () => {
//     if(authInstance) return authInstance;
//
//     const mongoose = await connectToDatabase();
//     const db = mongoose.connection.db;
//
//     if(!db) throw new Error('MongoDB connection not found');
//
//     authInstance = betterAuth({
//         database: mongodbAdapter(db as any),
//         secret: process.env.BETTER_AUTH_SECRET,
//         baseURL: process.env.BETTER_AUTH_URL,
//         emailAndPassword: {
//             enabled: true,
//             disableSignUp: false,
//             requireEmailVerification: false,
//             minPasswordLength: 8,
//             maxPasswordLength: 128,
//             autoSignIn: true,
//         },
//         plugins: [nextCookies()],
//     });
//
//     return authInstance;
// }
//
// export const auth = await getAuth();


// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { connectToDatabase } from "@/database/mongoose";
// import { nextCookies } from "better-auth/next-js";
//
// let authInstance: ReturnType<typeof betterAuth> | null = null;
//
// // 1. Explicitly type the return promise so TypeScript KNOWS it will never return null
// export const getAuth = async (): Promise<ReturnType<typeof betterAuth>> => {
//     if(authInstance) return authInstance;
//
//     const mongoose = await connectToDatabase();
//     const db = mongoose.connection.db;
//
//     if(!db) throw new Error('MongoDB connection not found');
//
//     authInstance = betterAuth({
//         database: mongodbAdapter(db as any),
//         // 2. Add the ! to tell TypeScript these environment variables exist
//         secret: process.env.BETTER_AUTH_SECRET!,
//         baseURL: process.env.BETTER_AUTH_URL!,
//         emailAndPassword: {
//             enabled: true,
//             disableSignUp: false,
//             requireEmailVerification: false,
//             minPasswordLength: 8,
//             maxPasswordLength: 128,
//             autoSignIn: true,
//         },
//         plugins: [nextCookies()],
//     });
//
//     return authInstance;
// }
//
// // 3. Because getAuth is strictly typed, `auth` is now guaranteed to be the auth object (not null)
// export const auth = await getAuth();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

// 1. Create a factory function.
// This allows TypeScript to perfectly read and infer your exact auth configuration.
const createAuthInstance = (db: any) => {
    return betterAuth({
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });
};

// 2. Extract the exact, highly-specific type from the factory
type AuthType = ReturnType<typeof createAuthInstance>;

// 3. Apply this exact type to your cached instance
let authInstance: AuthType | null = null;

export const getAuth = async (): Promise<AuthType> => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error('MongoDB connection not found');

    authInstance = createAuthInstance(db);

    return authInstance;
};

// 4. Because getAuth returns Promise<AuthType>, `auth` is strictly typed and never null.
export const auth = await getAuth();
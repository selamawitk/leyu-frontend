// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { JWTEncodeParams, JWTDecodeParams } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";


type UserRole = "SuperAdmin" | "ProjectManager" | "Facilitator" | "Reviewer" | "QualityAssurance" | "Contributor";

interface ExtendedUser {
  id: string;
  role: UserRole;
  profile_picture: string | null;
  email: string;
  name?: string | null;
  username: string;
  access_token: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  expires_at?: number;
}

interface ExtendedJWT extends Omit<JWT, 'role'> {
  id: string;
  role: UserRole;
  access_token: string;
  expires_at?: number;
  profile_picture?: string | null;
  username?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    access_token: string;
  }
  interface User {
    access_token?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    profile_picture?: string | null;
  }
  interface JWT {
    id?: string;
    role?: string;
    access_token?: string;
    expires_at?: number;
    profile_picture?: string | null;
    username?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
  }
}

const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: any
      ) {
        try {

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/auth/login`,

            {
              username: credentials?.email,
              password: credentials?.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const responseData = response.data.data;

          if (!responseData || !responseData.user) {
          
            return null;
          }

          

          return {
            id: responseData.user.id,
            email: responseData.user.email,
            username: responseData.user.email,
            first_name: responseData.user.first_name,
            last_name: responseData.user.last_name,
            middle_name: responseData.user.middle_name,
            profile_picture: responseData.user.profile_picture,
            role: responseData.user.role.name as UserRole, 
            access_token: responseData.access_token,
          } as any;
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<any> {
      const extendedToken = token as ExtendedJWT;

      if (account && user) {
        // Initial sign in
        const extendedUser = user as ExtendedUser;

        extendedToken.id = extendedUser.id;
        extendedToken.role = extendedUser.role;
        extendedToken.access_token = extendedUser.access_token;
        extendedToken.profile_picture = extendedUser.profile_picture;
        extendedToken.email = extendedUser.email;
        extendedToken.username = extendedUser.username;
        extendedToken.first_name = extendedUser.first_name;
        extendedToken.last_name = extendedUser.last_name;
        extendedToken.middle_name = extendedUser.middle_name;
        extendedToken.expires_at = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      }

      // Check if token has expired on every request
      if (extendedToken.expires_at && Date.now() >= extendedToken.expires_at) {
     
        // Return empty token to force logout
        return {} as JWT;
      }

      return extendedToken;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
   
      // Check if token has expired
      const isExpired = extendedToken.expires_at && Date.now() >= extendedToken.expires_at;

      // If token is empty, expired, or missing required data, don't populate session data
      if (!extendedToken.id || !extendedToken.access_token || isExpired) {
        if (isExpired) {
          
        }
   
        // Return session with no user data to trigger logout
        return { ...session, user: undefined, access_token: undefined } as any;
      }

      if (session.user) {
        session.user.id = extendedToken.id;
        session.user.role = extendedToken.role;
        session.access_token = extendedToken.access_token;
        session.user.profile_picture = extendedToken.profile_picture || null;
        session.user.email = (extendedToken.email as string) || "";
        session.user.username = extendedToken.username || "";
        session.user.first_name = extendedToken.first_name || "";
        session.user.middle_name = extendedToken.middle_name || "";
        session.user.last_name = extendedToken.last_name || "";
        session.user.expires_at = extendedToken.expires_at;

      }
      return session;
    },
    async redirect({ url, baseUrl }) {
     

      // Handle relative URLs by making them absolute
      let fullUrl = url;
      if (url.startsWith('/')) {
        fullUrl = `${baseUrl}${url}`;
      }

      try {
        const urlObj = new URL(fullUrl);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');

        if (callbackUrl) {
          const fullCallbackUrl = callbackUrl.startsWith('/') ? `${baseUrl}${callbackUrl}` : callbackUrl;
   
          return fullCallbackUrl;
        }
      } catch (error) {
      
      }

      if (url === baseUrl || url === `${baseUrl}/` || url.includes('/login')) {
       
        return baseUrl;
      }


      if (fullUrl.startsWith(baseUrl)) {
       
        return fullUrl;
      }

     
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" && process.env.NEXTAUTH_URL?.startsWith("https"),
        domain: undefined,
      },
    },
  },

};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

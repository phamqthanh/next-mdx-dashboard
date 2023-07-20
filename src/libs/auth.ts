import { GetServerSideProps } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
        savePassword: { label: "Save password", type: "checkbox" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        if (user) {
          return user;
        } else {
          // If no error and we have user data, return it
          // Return null if user data could not be retrieved
          return null;
        }
      },
    }),
  ],
  jwt: {},
  cookies: {},
  callbacks: {
    // jwt({ token, account, user, session, profile, trigger }) {
    //   const data = { ...token, ...user };
    //   return data;
    // },
    // async session({ session, user, token }) {
    //   const { access_token, ..._user } = token as any;
    //   if (access_token) {
    //     const responseUser = await User.user({
    //       headers: { Authorization: "Bearer " + access_token },
    //     });
    //     if (responseUser.status === 200 && responseUser.data) {
    //       session.accessToken = access_token;
    //       session.user = Object.assign(responseUser.data, _user, {
    //         email: responseUser.data.email,
    //         picture: "",
    //       });
    //       return session;
    //     } else return null as any;
    //   }
    //   session.accessToken = token.access_token!;
    //   session.user = _user;
    //   return session;
    // },
  },
};

export function withServerSideSession<T extends {}>(
  cb: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async function wrappedGetServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    const response = await cb(context);
    if ("props" in response)
      return {
        props: {
          ...response.props,
          session,
        },
      };

    return response;
  };
}

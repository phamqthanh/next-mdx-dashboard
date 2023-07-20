import SecondaryLayoutCode from "@/components/layouts/secondary/layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Fragment } from "react";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const Layout = Component.getLayout || (pageProps.sections ? SecondaryLayoutCode : Fragment);

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

import type { NextComponentType, NextPageContext } from "next";
import "next/app";
import { Router } from "next/router";
import { PropsWithChildren, ReactElement } from "react";

declare module "next" {
  export type GetLayout<P = unknown> = (
    page: PropsWithChildren<P>
  ) => ReactElement<any, any> | null;
  export type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P & { router: Router }
  > & {
    getLayout?: GetLayout<P>;
  };
}

declare module "next/app" {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P> & {
      getLayout?: GetLayout<P>;
    };
    router: Router;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    pageProps: P & {
      /** Initial session passed in from `getServerSideProps` or `getInitialProps` */
      session?: Session;
    };
  };
}

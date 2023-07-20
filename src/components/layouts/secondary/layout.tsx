import { MDXProvider } from "@mdx-js/react";
import { motion } from "framer-motion";
import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "./header";
import { Logo } from "./logo";
import * as mdxComponents from "./mdx";
import { Navigation, NavigationGroupType } from "./navigation";
import { Prose } from "./prose";
import { SectionItem, SectionProvider } from "./section-provider";

type Props = {
  children?: React.ReactNode;
  sections?: SectionItem[];
  className?: string;
} & JSX.IntrinsicElements["div"];
type Nav = {
  title: string;
  links: (NavigationGroupType["links"][0] & { icon?: string })[];
};
const Routers = { HOME: "/admin", CATEGORIES: "/admin/categories" };
export const navigation: Nav[] = [
  {
    title: "Doanh nghiệp",
    links: [
      {
        title: "Trang chủ",
        href: Routers.HOME,
        icon: "/icons/grid.svg",
        matchPath: true,
        isExact: true,
      },
      {
        title: "Danh mục",
        href: Routers.CATEGORIES,
        icon: "/icons/calender.svg",
        showOnMatch: true,
        isExact: true,
        // subs: [{ href: Routers.HOME, title: "Thêm danh mục", isExact: true }],
      },
    ],
  },
  {
    title: "Tài liệu",
    links: [
      { title: "Docs", href: "/docs", isExact: true },
      { title: "Authentication", href: "/docs/authentication", isExact: true },
      { title: "Errors", href: "/docs/errors", isExact: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Users", href: "/admin/users" },
      // { title: 'Conversations', href: '/conversations' },
      // { title: 'Messages', href: '/messages' },
      // { title: 'Groups', href: '/groups' },
      // { title: 'Attachments', href: '/attachments' },
    ],
  },
];

export const SecondaryLayoutRoot = ({ sections, children, className, ...rest }: Props) => {
  const { status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") router.replace(Routers.LOGIN);
  // }, [router, status]);
  // if (status === "unauthenticated") return null;

  return (
    <SectionProvider sections={sections || []}>
      <style jsx global>
        {`
          body {
            background-color: rgba(var(--b1) / var(--tw-bg-opacity, 1));
          }
        `}
      </style>
      {status === "loading" ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
          <Logo height={40} className="fill-secondary-600 dark:fill-white" />
          <p className="fontb mt-3">Đang tải</p>
        </div>
      ) : (
        <div className="lg:ml-72 xl:ml-80">
          <motion.header
            layoutScroll
            className="scrollbar-dark contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
          >
            <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
              <div className="hidden lg:flex">
                <Link href="/" aria-label="Home">
                  <Logo height={40} className="fill-secondary-600 dark:fill-white" />
                </Link>
              </div>
              <Header navigation={navigation} />
              <Navigation navigation={navigation} className="hidden lg:mt-10 lg:block" />
            </div>
          </motion.header>

          <div
            className={
              className ??
              "relative min-h-screen px-4 pb-6 pt-14 dark:text-white sm:px-6 md:pb-10 lg:px-8"
            }
            {...rest}
          >
            {children}
          </div>
        </div>
      )}
    </SectionProvider>
  );
};
const SecondaryLayoutCode = (props: Props) => {
  return (
    <SecondaryLayoutRoot
      sections={props.sections}
      className="relative min-h-screen px-4 pt-14 text-base-content dark:text-white sm:px-6 lg:px-8"
      data-theme={undefined}
    >
      <MDXProvider components={mdxComponents as any}>
        <main className="py-16">
          <Prose as="article">{props.children}</Prose>
        </main>
      </MDXProvider>
    </SecondaryLayoutRoot>
  );
};

export default SecondaryLayoutCode;

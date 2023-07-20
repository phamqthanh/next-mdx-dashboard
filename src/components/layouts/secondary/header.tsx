import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import React, { CSSProperties } from "react";

import { useSession } from "next-auth/react";
import { Logo } from "./logo";
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore,
} from "./mobile-navigation";
import { ModeToggle } from "./mode-toggle";
import { NavigationGroupType } from "./navigation";
// import { ModeToggle } from '@/components/mode-toggle';
// import { MobileSearch, Search } from '@/components/Search';

function TopLevelNavItem({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        target={target}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export const Header = React.forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { navigation?: NavigationGroupType[] }
>(function Header({ className, navigation }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  const { data } = useSession();
  const user = data?.user || {};

  let { scrollY } = useScroll();
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8",
        !isInsideMobileNavigation && "backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80",
        isInsideMobileNavigation
          ? "bg-white dark:bg-zinc-900"
          : "bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]"
      )}
      style={
        {
          "--bg-opacity-light": bgOpacityLight,
          "--bg-opacity-dark": bgOpacityDark,
        } as CSSProperties
      }
    >
      <div
        className={clsx(
          "absolute inset-x-0 top-full h-px transition",
          (isInsideMobileNavigation || !mobileNavIsOpen) && "bg-zinc-900/10 dark:bg-white/10"
        )}
      />
      {/* <Search /> */}
      <div className="hidden lg:block lg:max-w-md lg:flex-auto"></div>
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation navigation={navigation} />
        <Link href="/" aria-label="Home">
          <Logo className="h-6 fill-zinc-600 dark:fill-white" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem target="_blank" href="https://dapi.5bib.com/swagger-ui/index.html#/">
              API
            </TopLevelNavItem>
            <TopLevelNavItem href="/admin/documentation">Documentation</TopLevelNavItem>
          </ul>
        </nav>
        <div className="md:dark:bg-white/15 hidden md:block md:h-5 md:w-px md:bg-zinc-900/10" />
        <div className="flex gap-4">
          <ModeToggle />
        </div>
        <div className="hidden min-[416px]:contents">
          <div className="flex items-center gap-x-3 text-zinc-600 dark:text-zinc-400">
            <div className="text-right">
              <p className="text-sm font-bold leading-5">{user.name}</p>
            </div>
            <div className="w-8">
              <div className="block-image block-square overflow-hidden rounded-full border border-white bg-zinc-900">
                <img
                  src={
                    user.avatar ||
                    "https://imagedelivery.net/5ejkUOtsMH5sf63fw6q33Q/1a091d0e-3d38-4da3-063a-4833e08cf500/thumbnail"
                  }
                  alt={user.name || user.email}
                  className="absolute inset-0"
                />
              </div>
            </div>
            <div className="border-l border-gray-500 py-5" />
            <div></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

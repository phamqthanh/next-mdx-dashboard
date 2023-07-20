import clsx from "clsx";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useRef } from "react";

import { remToPx } from "@/utilities/rem-to-px";
import { signOut } from "next-auth/react";
import { Button } from "./button";
import { useIsInsideMobileNavigation } from "./mobile-navigation";
import { useSectionStore } from "./section-provider";
import { Tag } from "./tag";

import useBoolean from "@/hooks/useBoolean";
import type { UrlObject } from "url";

export interface NavigationItemType {
  title: string;
  href: string;
  includeParams?: boolean;
  matchPath?: boolean | string | ((pathname: string) => boolean);
  show?: boolean | string | ((pathname: string) => boolean);
  isExact?: boolean;
  showOnMatch?: boolean;
  hideSubOnMatch?: boolean;
  tag?: string;
}
export interface NavigationGroupType {
  title: string;
  links: (NavigationItemType & {
    subs?: Array<NavigationItemType>;
    subMatch?: string | ((pathname: string) => boolean);
  })[];
}

function useInitialValue<T>(value: T, condition = true): T {
  let initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function TopLevelNavItem({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function NavLink({
  href,
  tag,
  active,
  isAnchorLink = false,
  children,
  shallow,
}: PropsWithChildren<{
  href: UrlObject | string;
  tag?: string;
  active?: boolean;
  isAnchorLink?: boolean;
  shallow?: boolean;
}>) {
  return (
    <Link
      href={href}
      shallow={shallow}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex justify-between gap-2 py-1 pr-3 text-sm transition",
        isAnchorLink ? "pl-7" : "pl-4",
        active
          ? "font-bold text-zinc-900 dark:text-white"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  );
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavigationGroupType;
  pathname: string;
}) {
  let [sections, visibleSections] = useInitialValue(
    [useSectionStore((s) => s.sections), useSectionStore((s) => s.visibleSections)],
    useIsInsideMobileNavigation()
  );

  let isPresent = useIsPresent();
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: "_top" }, ...sections].findIndex((section) => section.id === visibleSections[0])
  );
  let itemHeight = remToPx(2);
  let height = isPresent ? Math.max(1, visibleSections.length) * itemHeight : itemHeight;
  let activePageIndex = group.links.findIndex((link) =>
    link.href === "/"
      ? link.href === pathname
      : !link.subs && link.isExact
      ? link.href === pathname
      : pathname.startsWith(link.href)
  );
  const link = group.links[activePageIndex];

  if (link?.subs && link.href !== pathname) {
    for (let index = 0; index < link.subs.length; index++) {
      const sub = link.subs[index];
      activePageIndex += 1;
      if (pathname.startsWith(sub.href)) break;
    }
  }
  let top = activePageIndex * itemHeight + firstVisibleSectionIndex * itemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/10 will-change-transform dark:bg-white/10"
      style={{ borderRadius: 8, height, top }}
    />
  );
}

function ActivePageMarker({ group, pathname }: { group: NavigationGroupType; pathname: string }) {
  let itemHeight = remToPx(2);
  let offset = remToPx(0.25);
  let activePageIndex = group.links.findIndex((link) =>
    link.href === "/"
      ? link.href === pathname
      : !link.subs && link.isExact
      ? link.href === pathname
      : pathname.startsWith(link.href)
  );
  const link = group.links[activePageIndex];

  if (link?.subs && link.href !== pathname) {
    for (let index = 0; index < link.subs.length; index++) {
      const sub = link.subs[index];
      activePageIndex += 1;
      if (pathname.startsWith(sub.href)) break;
    }
  }
  let top = offset + activePageIndex * itemHeight;

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  );
}

function isMatchRoute(link: NavigationItemType, pathname: string) {
  return pathname === "/"
    ? pathname === link.href
    : link.isExact
    ? pathname === link.href
    : pathname.startsWith(link.href);
}
function NavigationGroup({
  group,
  className,
}: {
  group: NavigationGroupType;
  className?: string | boolean;
}) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  );

  let isActiveGroup =
    group.links.findIndex((link) =>
      router.pathname === "/admin" || link.href === "/admin"
        ? router.pathname === link.href
        : router.pathname.startsWith(link.href)
    ) !== -1;

  return (
    <li className={clsx("relative mt-6", className)}>
      <motion.h2 layout="position" className="text-xs font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && <VisibleSectionHighlight group={group} pathname={router.pathname} />}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/20"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && <ActivePageMarker group={group} pathname={router.pathname} />}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => {
            const isMatchedRoot = isMatchRoute(link, router.pathname);
            return (
              <motion.li key={link.href} layout="position" className="relative">
                <NavLink href={link.href} active={isMatchedRoot}>
                  {link.title}
                </NavLink>
                <AnimatePresence mode="popLayout" initial={false}>
                  {isMatchedRoot && sections.length > 0 && (
                    <motion.ul
                      role="list"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { delay: 0.1 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15 },
                      }}
                      className="relative"
                    >
                      {sections.map((section) => (
                        <li key={section.id}>
                          <NavLink
                            href={`${link.href}#${section.id}`}
                            tag={section.tag}
                            isAnchorLink
                          >
                            {section.title}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                  {link.subs &&
                    (link.subMatch
                      ? typeof link.subMatch === "string"
                        ? router.pathname.startsWith(link.subMatch)
                        : link.subMatch(router.pathname)
                      : isMatchedRoot) && (
                      <motion.ul
                        role="list"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.1 },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.15 },
                        }}
                        className="relative"
                      >
                        {link.subs.map((link) => {
                          return (
                            <AnimatePresence mode="popLayout" initial={false} key={link.href}>
                              {(
                                typeof link.show === "undefined"
                                  ? true
                                  : typeof link.show === "boolean"
                                  ? link.show
                                  : typeof link.show === "string"
                                  ? link.show === router.pathname
                                  : link.show(router.pathname)
                              ) ? (
                                <motion.li
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    transition: { delay: 0.1 },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15 },
                                  }}
                                >
                                  <NavLink
                                    href={{
                                      pathname: link.href,
                                      query: link.includeParams ? router.query : undefined,
                                    }}
                                    tag={link.tag}
                                    shallow
                                    active={router.pathname.startsWith(link.href)}
                                    isAnchorLink
                                  >
                                    {link.title}
                                  </NavLink>
                                </motion.li>
                              ) : null}
                            </AnimatePresence>
                          );
                        })}
                      </motion.ul>
                    )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export function Navigation({
  navigation,
  ...props
}: JSX.IntrinsicElements["nav"] & { navigation: NavigationGroupType[] }) {
  const isLoading = useBoolean();
  const logout = () => {
    isLoading.setTrue();
    signOut({ callbackUrl: "/" }).finally(isLoading.setFalse);
  };
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="#">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && "md:mt-0"}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6">
          <Button disabled={isLoading.value} variant="primary" className="w-full" onClick={logout}>
            Bay màu
          </Button>
        </li>
      </ul>
    </nav>
  );
}

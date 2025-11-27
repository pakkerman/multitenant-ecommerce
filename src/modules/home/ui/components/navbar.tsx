"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 lg:text-lg text-md",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="flex h-20 justify-between border-b-4 bg-white font-medium">
      <Link
        href="/"
        className="flex max-w-min items-center pl-6 lg:max-w-none lg:flex-1"
      >
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          funroad
        </span>
      </Link>

      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="hidden items-center justify-center gap-4 px-6 lg:flex lg:flex-1">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={item.href === pathname}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-2 pr-4">
        {session.data?.user ? (
          <div className="flex items-center h-full justify-center gap-4 border-l-4 border-black px-8 text-lg ">
            <Image
              src={"/auth-bg.png"}
              alt="profile picture"
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full border"
            />
            <p>{session.data?.user.username}</p>
          </div>
        ) : (
          <Button
            asChild
            variant="elevatedReversed"
            className="rounded-none border-2 bg-white px-12 text-lg transition-colors hover:bg-pink-400"
          >
            <Link prefetch href="/sign-in">
              Login
            </Link>
          </Button>
        )}
        <Button
          asChild
          variant="elevatedReversed"
          className="rounded-none border-white border-2 bg-cyan-400 px-12 text-lg text-black transition-colors hover:bg-pink-400 hover:text-black"
        >
          {session.data?.user ? (
            <Link href="/admin">Dashboard</Link>
          ) : (
            <Link prefetch href="/sign-up">
              Start Selling
            </Link>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center lg:hidden">
        <Button
          variant="elevatedReversed"
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            <Link
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              href="/sign-in"
              onClick={() => onOpenChange(false)}
            >
              Login
            </Link>
            <Link
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              href="/sign-up"
              onClick={() => onOpenChange(false)}
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

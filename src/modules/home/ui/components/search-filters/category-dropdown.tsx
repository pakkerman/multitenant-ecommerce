"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { SubcategoryMenu } from "./subcategory-menu";
import { Button } from "@/components/ui/button";

interface Props {
  category: CategoriesGetManyOutput[1];
  isActive: boolean;
  isNavigationHovered: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (category.subcategories) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
      className="relative"
    >
      <div className="relative">
        <Button
          variant="elevatedReversed"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full text-black hover:bg-white hover:border-primary",
            isActive &&
              !isNavigationHovered &&
              "bg-white border-primary shadow-none translate-0",
            isOpen && "bg-white border-primary shadow-none translate-0",
          )}
          style={{ backgroundColor: category.color || "white" }}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2 border-b-[10px] ",
              isOpen && "opacity-100",
            )}
          ></div>
        )}
      </div>
      <SubcategoryMenu category={category} isOpen={isOpen} />
    </div>
  );
};

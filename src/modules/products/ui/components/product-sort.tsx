"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useProductFilters } from "../../hooks/use-product-filters";

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center ">
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "bg-white rounded-none  border-l-2 border-t-0 border-r-0 border-b-0 hover:bg-cyan-400/80",
          filters.sort === "curated" && "bg-cyan-400",
        )}
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "bg-white rounded-none border-l-2 border-t-0 border-r-0 border-b-0 hover:bg-cyan-400/80",
          filters.sort === "trending" && "bg-cyan-400",
        )}
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "bg-white rounded-none border-l-2 border-t-0 border-r-0 border-b-0 hover:bg-cyan-400/80",
          filters.sort === "hot_and_new" && "bg-cyna-400",
        )}
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        Hot & New
      </Button>
    </div>
  );
};

import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { LoaderIcon } from "lucide-react";

import { DEFAULT_LIMIT } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (prev) => {
            return prev.docs.length > 0 ? prev.nextPage : undefined;
          },
        },
      ),
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              onClick={() => onClick(tag.name)}
              className="flex cursor-pointer items-center justify-between rounded-md px-1"
            >
              <p
                className={cn(
                  "font-medium px-1 rounded-md",
                  value?.includes(tag.name) && "bg-black text-white",
                )}
              >
                {tag.name}
              </p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="cursor-pointer justify-start text-start font-medium underline disabled:opacity-50"
        >
          Load more...
        </button>
      )}
    </div>
  );
};

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleXIcon } from "lucide-react";

interface CheckoutSidebarProps {
  total: number;
  onCheckout: () => void;
  isCancelled?: boolean;
  isPending?: boolean;
}

export const CheckoutSidebar = ({
  total,
  onCheckout,
  isCancelled,
  isPending,
}: CheckoutSidebarProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Total</h4>
        <h4 className="text-lg font-medium">{formatCurrency(total)}</h4>
      </div>

      <div className="flex items-center justify-center p-4">
        <Button
          variant="elevated"
          disabled={isPending}
          onClick={onCheckout}
          size="lg"
          className="w-full bg-primary text-base text-white hover:bg-pink-400 hover:text-primary"
        >
          Checkout
        </Button>
      </div>
      {isCancelled && (
        <div className="flex items-center justify-center border-t p-4">
          <div className="w-full items-center rounded border border-red-400 bg-red-100 px-4 py-3 font-medium">
            <div className="flex items-center">
              <CircleXIcon className="mr-2 size-6 fill-red-500 text-red-100" />
              <span className="">Checkout failed. Please try again</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

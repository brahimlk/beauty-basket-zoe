
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  subtotal: number;
  isAuthenticated: boolean;
  onCheckout: () => void;
}

export const OrderSummary = ({ 
  subtotal, 
  isAuthenticated, 
  onCheckout 
}: OrderSummaryProps) => {
  return (
    <div className="h-fit p-6 border rounded-lg bg-card space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={onCheckout}
      >
        {isAuthenticated ? "Checkout" : "Sign in to Checkout"}
      </Button>
    </div>
  );
};

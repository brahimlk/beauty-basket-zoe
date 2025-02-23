
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product, CartItem as CartItemType, GuestCartItem } from "@/types/database";

interface CartItemProps {
  item: (CartItemType & { product: Product }) | GuestCartItem;
  isAuthenticated: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ 
  item, 
  isAuthenticated, 
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) => {
  const id = isAuthenticated 
    ? (item as CartItemType & { product: Product }).id 
    : item.product_id;

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-card">
      <img
        src={item.product.image_url}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-primary font-medium">
          ${item.product.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-destructive"
            onClick={() => onRemove(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

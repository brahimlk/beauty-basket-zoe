
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType, Product } from "@/types/database";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    items, 
    isLoading, 
    subtotal, 
    updateQuantity, 
    removeItem, 
    isAuthenticated 
  } = useCart();

  const authenticatedCheckout = async () => {
    if (!user || items.length === 0) return;

    try {
      const totalAmount = subtotal;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (clearError) throw clearError;

      toast.success("Order placed successfully!");
      // You would typically redirect to an order confirmation page here
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to place order");
    }
  };

  const guestCheckout = () => {
    navigate("/auth");
    toast.info("Please sign in or sign up to complete your purchase");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20">
          <div className="text-center">Loading cart...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-20">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const itemKey = isAuthenticated
                  ? (item as CartItemType & { product: Product }).id
                  : item.product_id;
                return (
                  <CartItem
                    key={itemKey}
                    item={item}
                    isAuthenticated={isAuthenticated}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                );
              })}
            </div>
            <OrderSummary
              subtotal={subtotal}
              isAuthenticated={isAuthenticated}
              onCheckout={isAuthenticated ? authenticatedCheckout : guestCheckout}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;

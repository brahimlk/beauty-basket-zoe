
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product, CartItem, GuestCartItem } from "@/types/database";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);

  // Load guest cart from localStorage
  useEffect(() => {
    if (!user) {
      const storedCart = localStorage.getItem("guestCart");
      if (storedCart) {
        setGuestCart(JSON.parse(storedCart));
      }
    }
  }, [user]);

  // Fetch cart items with product details for authenticated users
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: cartData, error: cartError } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products (*)
        `)
        .eq("user_id", user.id);

      if (cartError) throw cartError;
      return cartData as (CartItem & { product: Product })[];
    },
    enabled: !!user,
  });

  // Setup real-time updates for authenticated cart
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const updateAuthenticatedQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        await removeFromAuthenticatedCart(cartItemId);
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartItemId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const updateGuestQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromGuestCart(productId);
      return;
    }

    const updatedCart = guestCart.map(item => 
      item.product_id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );

    setGuestCart(updatedCart);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
  };

  const removeFromAuthenticatedCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw error;
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const removeFromGuestCart = (productId: string) => {
    const updatedCart = guestCart.filter(item => item.product_id !== productId);
    setGuestCart(updatedCart);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const authenticatedCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

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
      const orderItems = cartItems.map((item) => ({
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

  const guestCheckout = async () => {
    navigate("/auth");
    toast.info("Please sign in or sign up to complete your purchase");
  };

  if (user && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20">
          <div className="text-center">Loading cart...</div>
        </main>
      </div>
    );
  }

  const items = user ? cartItems : guestCart;
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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
              {items.map((item) => (
                <div
                  key={user ? (item as CartItem & { product: Product }).id : item.product_id}
                  className="flex gap-4 p-4 border rounded-lg bg-card"
                >
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
                        onClick={() => {
                          if (user) {
                            updateAuthenticatedQuantity(
                              (item as CartItem & { product: Product }).id, 
                              item.quantity - 1
                            );
                          } else {
                            updateGuestQuantity(
                              item.product_id,
                              item.quantity - 1
                            );
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (user) {
                            updateAuthenticatedQuantity(
                              (item as CartItem & { product: Product }).id,
                              item.quantity + 1
                            );
                          } else {
                            updateGuestQuantity(
                              item.product_id,
                              item.quantity + 1
                            );
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-destructive"
                        onClick={() => {
                          if (user) {
                            removeFromAuthenticatedCart(
                              (item as CartItem & { product: Product }).id
                            );
                          } else {
                            removeFromGuestCart(item.product_id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                onClick={user ? authenticatedCheckout : guestCheckout}
              >
                {user ? "Checkout" : "Sign in to Checkout"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;

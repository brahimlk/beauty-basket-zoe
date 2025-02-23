
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Product, CartItem, GuestCartItem } from "@/types/database";

export const useCart = () => {
  const { user } = useAuth();
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
        .select(`*, product:products (*)`)
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

  const items = user ? cartItems : guestCart;
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    items,
    isLoading: user && isLoading,
    subtotal,
    updateQuantity: user ? updateAuthenticatedQuantity : updateGuestQuantity,
    removeItem: user ? removeFromAuthenticatedCart : removeFromGuestCart,
    isAuthenticated: !!user,
  };
};


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product } from "@/types/database";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      return data as Product;
    },
  });

  const addToCart = async () => {
    if (!product) return;
    
    if (user) {
      try {
        const { error } = await supabase.from("cart_items").upsert({
          user_id: user.id,
          product_id: id,
          quantity,
        });

        if (error) throw error;
        toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
      }
    } else {
      // Handle guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existingItem = guestCart.find((item: any) => item.product_id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({
          product_id: id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            discount: product.discount,
            description: product.description,
            category: product.category,
          },
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20">
          <div className="text-center">Loading product details...</div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20">
          <div className="text-center">Product not found</div>
        </main>
      </div>
    );
  }

  const details = [
    "100% Natural Ingredients",
    "Suitable for all skin types",
    "Paraben-free",
    "Cruelty-free",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.discount && (
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-2">
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={increaseQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={addToCart} className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;


import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

const ProductCard = ({ id, name, price, image, discount }: ProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const addToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }
    toast.success("Added to cart!");
  };

  const addToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to add items to wishlist");
      navigate("/auth");
      return;
    }
    toast.success("Added to wishlist!");
  };

  return (
    <div className="product-card group animate-fade-up">
      <Link to={`/products/${id}`} className="block">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-300"
          />
          {discount && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
              {discount}% OFF
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={addToWishlist}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-primary">
              ${price.toFixed(2)}
            </span>
            {discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${(price * (1 + discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <Button onClick={addToCart} size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

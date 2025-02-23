
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigateHome();
            }}
          >
            BeautyBasket
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/categories" className="nav-link">
              Categories
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-primary text-white rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              </Button>
            </Link>
            {user ? (
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                onClick={() => {
                  setIsOpen(false);
                  navigateHome();
                }}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/cart"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Cart ({items.length})
              </Link>
              {user ? (
                <button
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { Search, User, ShoppingCart, Menu, ChevronDown, X, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { apiService, type Product } from "@/lib/api";

const categories = [
  {
    name: "Medical",
    subcategories: [
      "Personal Care",
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Foot, Hand & Nail Care",
      "Salon Equipment",
      "Shave & Hair Removal",
      "Fragrance",
    ],
  },
  {
    name: "Groceries",
    subcategories: ["General food items", "Daily essentials"],
  },
  {
    name: "FashionBeauty",
    subcategories: [
      "Menswear",
      "Women's Wear",
      "Kids Wear",
      "Men's Shoes",
      "Women's Shoes",
      "Kids Shoes",
      "Watches",
      "Luggage",
    ],
  },
  {
    name: "Devices",
    subcategories: [
      "Cell Phones & Accessories",
      "Laptops",
      "Televisions",
      "Refrigerators",
      "Smart Watches",
    ],
  },
  {
    name: "Electrical",
    subcategories: [
      "Solar Panels",
      "Solar Fencing Kit",
      "Batteries",
      "Transformers",
      "Wiring Cables",
      "LED Bulbs",
      "Tube Lights",
      "Ceiling Fan",
    ],
  },
  {
    name: "Automotive",
    subcategories: [
      "Bike Accessories",
      "Car Accessories",
      "Engine Oil",
      "Brake Fluid",
      "Air Filter",
    ],
  },
  {
    name: "Sports",
    subcategories: [
      "Cricket Bats",
      "Cricket Balls",
      "Stumps",
      "Cricket Kit",
      "Volleyball",
      "Volleyball Net",
    ],
  },
  {
    name: "HomeInterior",
    subcategories: [
      "Gypsum False Ceiling",
      "Cove Lights",
      "Main Door", 
      "Wall Paint",
      "Wallpaper",
      "Curtains",
      "Wall Tiles",
    ],
  },
] ;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleSearchFocus = () => {
    if (isMobile) {
      navigate("/search-suggestions");
    }
    setShowSearchSuggestions(true);
  };

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch suggestions
  useEffect(() => {
    if (!showSearchSuggestions) return;
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestedProducts([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const res = await apiService.suggest(q);
        if (!controller.signal.aborted) {
          setSuggestions(res.data.suggestions || []);
          setSuggestedProducts(res.data.products || []);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setSuggestedProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingSuggestions(false);
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [searchQuery, showSearchSuggestions]);

  return (
    <div className="bg-cyan-100 font-roboto">
      {/* Main Navbar */}
      <div className="container mx-auto px-2 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-800 hover:bg-cyan-200 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
                         <Link to="/" className="flex items-center space-x-2">
               <img 
                 src="/logo.jpg" 
                 alt="Nevyra Logo" 
                 className="h-8 w-auto mix-blend-multiply filter drop-shadow-sm"
               />
               <span className="text-xl font-bold text-gray-800">NEVYRA</span>
             </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block" ref={searchRef}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full pl-4 pr-12 py-2 bg-background text-foreground border-none rounded-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = searchQuery.trim();
                    if (value) {
                      setShowSearchSuggestions(false);
                      navigate(`/search?q=${encodeURIComponent(value)}`);
                    }
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full px-4 bg-warning hover:bg-warning/90 text-warning-foreground rounded-l-none rounded-r-sm"
                onClick={() => {
                  const value = searchQuery.trim();
                  if (value) {
                    setShowSearchSuggestions(false);
                    apiService.addRecentSearch(value).catch(() => {});
                    navigate(`/search?q=${encodeURIComponent(value)}`);
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>

              {showSearchSuggestions && (
                <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-md overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {isLoadingSuggestions ? (
                      <div className="p-3 text-sm text-muted-foreground">Searching…</div>
                    ) : (
                      <>
                        {suggestions.length === 0 && suggestedProducts.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground">No suggestions</div>
                        ) : (
                          <>
                            {suggestions.length > 0 && (
                              <div className="p-2">
                                <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Suggestions</div>
                                {suggestions.map((s, i) => (
                                  <button
                                    key={i}
                                    className="w-full text-left px-2 py-2 hover:bg-accent rounded"
                                    onClick={() => {
                                      setShowSearchSuggestions(false);
                                      navigate(`/search?q=${encodeURIComponent(s)}`);
                                    }}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}

                            {suggestedProducts.length > 0 && (
                              <div className="border-t border-border p-2">
                                <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Top products</div>
                                <div className="divide-y divide-border">
                                  {suggestedProducts.map((p) => (
                                    <button
                                      key={p.id}
                                      className="w-full flex items-center px-2 py-2 hover:bg-accent"
                                      onClick={() => {
                                        setShowSearchSuggestions(false);
                                        navigate(`/product/${p.id}`);
                                      }}
                                    >
                                      <img
                                        src={p.images?.[0] || "/placeholder.svg"}
                                        alt={p.title}
                                        className="w-10 h-10 object-cover rounded mr-3"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm truncate text-foreground">{p.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{p.category} {p.subCategory ? `• ${p.subCategory}` : ""}</div>
                                      </div>
                                      <div className="text-sm font-medium ml-3">${p.price}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-800 hover:bg-cyan-200 hidden md:flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">
                      {user?.firstName || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex items-center text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:bg-cyan-200 hidden md:flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Login</span>
                </Button>
              </Link>
            )}
            

            <Link to="/profile">
              <Button
                variant="ghost"
                className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span className="text-sm hidden md:inline">Profile</span>
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                variant="ghost"
                className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1 relative p-1"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm hidden md:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-warning text-warning-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full pl-4 pr-12 py-2 bg-background text-foreground border-none rounded-sm"
              onFocus={handleSearchFocus}
              readOnly
            />
            <Button
              size="sm"
              className="absolute right-0 top-0 h-full px-4 bg-warning hover:bg-warning/90 text-warning-foreground rounded-l-none rounded-r-sm"
              onClick={handleSearchFocus}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-2">
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-8 py-2">
            {categories.map((category) => (
              <HoverCard key={category.name} openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <Link to={`/category/${category.name}`}>
                    <Button
                      variant="ghost"
                      className="text-foreground hover:bg-muted flex items-center space-x-1"
                    >
                      <span className="text-sm">{category.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-popover border border-border p-0">
                  <div className="py-2">
                    {category.subcategories.map((subcategory, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-popover-foreground hover:bg-accent cursor-pointer"
                      >
                        <Link
                          to={`/category/${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="w-full block"
                        >
                          {subcategory}
                        </Link>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>

          {/* Mobile Categories Quick Access */}
          <div className="md:hidden py-2 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="whitespace-nowrap px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Category Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Mobile Login/User Links */}
              <div className="pb-4 border-b border-border">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Welcome, {user?.firstName} {user?.lastName}
                    </div>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100 w-full justify-start"
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">Login</span>
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Categories */}
              {categories.map((category) => (
                <div key={category.name} className="border-b border-border pb-2">
                  <div className="w-full flex items-center justify-between font-medium text-foreground mb-2 py-2 hover:bg-muted rounded px-2">
                    <Link 
                      to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{category.name}</span>
                    </Link>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="p-1"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedCategory === category.name ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                  {expandedCategory === category.name && (
                    <div className="space-y-1 pl-4 bg-muted/30 rounded p-2">
                      {category.subcategories.map((subcategory, index) => (
                        <Link
                          key={index}
                          to={`/category/${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block text-sm text-muted-foreground hover:text-foreground py-2 px-2 rounded hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

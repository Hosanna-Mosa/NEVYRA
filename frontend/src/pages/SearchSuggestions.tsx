import { useState, useEffect } from "react";
import { Search, ArrowLeft, TrendingUp, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock search suggestions data
const popularSearches = [
  "laptop",
  "smartphone",
  "shoes",
  "dress",
  "watch",
  "headphones",
  "camera",
  "tablet"
];

const recentSearches = [
  "gaming laptop",
  "wireless earbuds",
  "running shoes",
  "summer dress"
];

const categorySuggestions = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Garden", icon: "🏠" },
  { name: "Sports", icon: "⚽" },
  { name: "Beauty", icon: "💄" },
  { name: "Books", icon: "📚" }
];

const SearchSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  // Get initial query from URL params
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Mock search suggestions based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const clearRecentSearches = () => {
    // In a real app, this would clear from localStorage
    console.log("Clear recent searches");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Logo */}
          <Link to="/" className="ml-3">
            <img 
              src="/logo.jpg" 
              alt="Nevyra Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Search Suggestions */}
        {searchQuery && suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Search Suggestions
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted flex items-center space-x-3"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted flex items-center space-x-3"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Suggestions */}
        {!searchQuery && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Browse Categories
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categorySuggestions.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}
                  className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results message */}
        {searchQuery && suggestions.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No suggestions found for "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions; 
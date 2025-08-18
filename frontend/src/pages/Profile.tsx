import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Eye, 
  Download,
  Star,
  Truck,
  Save,
  Edit,
  Trash2
} from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";



const wishlistItems = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    image: phoneProduct,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch Series 8",
    image: shoesProduct,
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.3,
    inStock: true
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const navigate = useNavigate();

  const { user, logout, isAuthenticated, wishlistIds, refreshWishlist } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    fetchUserProfile();
    fetchAddresses();
    // Ensure wishlist count is up to date
    refreshWishlist().catch(() => {});
  }, [isAuthenticated, navigate]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUserProfile(response.data);
        setProfileForm({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || ""
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try logging in again.",
        variant: "destructive",
      });
      // If profile fetch fails, redirect to login
      navigate("/auth");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.updateProfile(profileForm);
      if (response.success) {
        setUserProfile(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.email || 
        !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.zipCode) {
      toast({
        title: "Error",
        description: "Please fill in all address fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiService.addAddress(newAddress);
      if (response.success) {
        setAddresses(response.data);
        setNewAddress({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          zipCode: ""
        });
        setShowAddAddress(false);
        toast({
          title: "Success",
          description: "Address added successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      const response = await apiService.deleteAddressByIndex(index);
      if (response.success) {
        setAddresses(response.data);
        toast({
          title: "Success",
          description: "Address deleted successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
const isMobile = useIsMobile();
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "shipped":
        return "bg-primary text-primary-foreground";
      case "processing":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>

                  <h2 className="text-xl font-semibold text-foreground">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                  {userProfile.phone && (
                    <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                  )}

                </div>

                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => navigate("/orders")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                  <Button
                    variant={activeTab === "wishlist" ? "default" : "ghost"}
                    className="w-full justify-between text-sm"
                    onClick={() => navigate("/wishlist")}
                  >
                    <span className="flex items-center"><Heart className="h-4 w-4 mr-2" />Wishlist</span>
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs h-5 min-w-[1.25rem] px-1">
                      {wishlistIds.size}
                    </span>
                  </Button>
                  <Button
                    variant={activeTab === "addresses" ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Saved Addresses
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveTab("profile")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>

                  <Separator className="my-4" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}
                  >

                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">


            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-foreground">My Wishlist</h1>
                  <span className="text-xs text-muted-foreground">{wishlistIds.size} items</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-3">
                        <div className="relative mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {item.discount}% OFF
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 p-1"
                          >
                            <Heart className="h-3 w-3 fill-current" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{item.rating}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-bold text-price">₹{item.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</span>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs py-2">
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">

                  <h1 className="text-2xl font-bold text-foreground">Saved Addresses</h1>
                  <Button onClick={() => setShowAddAddress(true)}>Add New Address</Button>
                </div>

                {showAddAddress && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="addr-firstName">First Name</Label>
                          <Input 
                            id="addr-firstName"
                            value={newAddress.firstName}
                            onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr-lastName">Last Name</Label>
                          <Input 
                            id="addr-lastName"
                            value={newAddress.lastName}
                            onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr-email">Email</Label>
                          <Input 
                            id="addr-email"
                            type="email"
                            value={newAddress.email}
                            onChange={(e) => setNewAddress({...newAddress, email: e.target.value})}
                          />

                        </div>
                        <div>
                          <Label htmlFor="addr-phone">Phone</Label>
                          <Input 
                            id="addr-phone"
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="addr-address">Address</Label>
                          <Input 
                            id="addr-address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr-city">City</Label>
                          <Input 
                            id="addr-city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addr-zipCode">Zip Code</Label>
                          <Input 
                            id="addr-zipCode"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleAddAddress}>Save Address</Button>
                        <Button variant="outline" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-4">Add your first address to get started</p>
                        <Button onClick={() => setShowAddAddress(true)}>Add Address</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    addresses.map((address, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">
                                  {address.firstName} {address.lastName}
                                </h3>
                                {index === 0 && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-1">{address.address}</p>
                              <p className="text-muted-foreground mb-1">{address.city}, {address.zipCode}</p>
                              <p className="text-muted-foreground">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteAddress(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
                  <Button 
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
                    

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input 
                          id="first-name" 
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input 
                          id="last-name" 
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 mt-6">
                        <Button onClick={handleProfileUpdate} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}

                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
                    
                    <div className="space-y-3 max-w-md">
                      <div>
                        <Label htmlFor="current-password" className="text-xs">Current Password</Label>
                        <Input id="current-password" type="password" className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="new-password" className="text-xs">New Password</Label>
                        <Input id="new-password" type="password" className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-new-password" className="text-xs">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" className="text-sm" />
                      </div>
                    </div>

                    <Button className="mt-4 text-sm">Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

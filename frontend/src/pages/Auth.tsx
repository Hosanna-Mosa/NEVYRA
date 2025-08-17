import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForgotPassword from "@/components/ForgotPassword";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  // Form errors
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    navigate(from);
    return null;
  }

  // Validation functions
  const validateLoginForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!registerForm.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (registerForm.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    
    if (!registerForm.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (registerForm.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!registerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (registerForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(registerForm.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!registerForm.password) {
      errors.password = "Password is required";
    } else if (registerForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(registerForm.password)) {
      errors.password = "Password must contain uppercase, lowercase, number, and special character";
    }
    
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Redirect to profile page after successful login
        navigate("/profile");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim() || undefined,
        password: registerForm.password,
        address: registerForm.address.trim() || undefined,
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Registration successful! Please login with your new account.",
        });
        // Redirect to login tab after successful registration
        setActiveTab("login");
        // Clear the registration form
        setRegisterForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          address: "",
        });
        // Pre-fill email in login form
        setLoginForm({
          email: registerForm.email.trim(),
          password: "",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = (formType: 'login' | 'register') => {
    if (formType === 'login') {
      setLoginErrors({});
    } else {
      setRegisterErrors({});
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Nevyra</h1>
                <p className="text-muted-foreground">Your trusted shopping destination</p>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                clearErrors(value === 'login' ? 'login' : 'register');
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${loginErrors.email ? 'border-red-500' : ''}`}
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, email: e.target.value });
                            if (loginErrors.email) clearErrors('login');
                          }}
                          required
                        />
                      </div>
                      {loginErrors.email && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {loginErrors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className={`pl-10 pr-10 ${loginErrors.password ? 'border-red-500' : ''}`}
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, password: e.target.value });
                            if (loginErrors.password) clearErrors('login');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {loginErrors.password && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {loginErrors.password}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <Button 
                        type="button"
                        variant="link" 
                        className="p-0 h-auto text-primary"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or login with</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-firstName">First Name *</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-firstName"
                            type="text"
                            placeholder="First name"
                            className={`pl-10 ${registerErrors.firstName ? 'border-red-500' : ''}`}
                            value={registerForm.firstName}
                            onChange={(e) => {
                              setRegisterForm({ ...registerForm, firstName: e.target.value });
                              if (registerErrors.firstName) clearErrors('register');
                            }}
                            required
                          />
                        </div>
                        {registerErrors.firstName && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {registerErrors.firstName}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="register-lastName">Last Name *</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-lastName"
                            type="text"
                            placeholder="Last name"
                            className={`pl-10 ${registerErrors.lastName ? 'border-red-500' : ''}`}
                            value={registerForm.lastName}
                            onChange={(e) => {
                              setRegisterForm({ ...registerForm, lastName: e.target.value });
                              if (registerErrors.lastName) clearErrors('register');
                            }}
                            required
                          />
                        </div>
                        {registerErrors.lastName && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {registerErrors.lastName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${registerErrors.email ? 'border-red-500' : ''}`}
                          value={registerForm.email}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, email: e.target.value });
                            if (registerErrors.email) clearErrors('register');
                          }}
                          required
                        />
                      </div>
                      {registerErrors.email && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className={`pl-10 ${registerErrors.phone ? 'border-red-500' : ''}`}
                          value={registerForm.phone}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, phone: e.target.value });
                            if (registerErrors.phone) clearErrors('register');
                          }}
                        />
                      </div>
                      {registerErrors.phone && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-address">Address</Label>
                      <div className="relative mt-1">
                        <Input
                          id="register-address"
                          type="text"
                          placeholder="Enter your address"
                          value={registerForm.address}
                          onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          className={`pl-10 pr-10 ${registerErrors.password ? 'border-red-500' : ''}`}
                          value={registerForm.password}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, password: e.target.value });
                            if (registerErrors.password) clearErrors('register');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {registerErrors.password && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.password}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className={`pl-10 pr-10 ${registerErrors.confirmPassword ? 'border-red-500' : ''}`}
                          value={registerForm.confirmPassword}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                            if (registerErrors.confirmPassword) clearErrors('register');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {registerErrors.confirmPassword && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Privacy Policy
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setActiveTab("register")}
                    >
                      Sign up here
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setActiveTab("login")}
                    >
                      Login here
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
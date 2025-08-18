import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const API_URL = "http://localhost:8000/api/admins/login";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    setLoading(true);
    try {
      const data = await adminAPI.login(values);
      if (!data.success) {
        setError(data.message || "Login failed");
        toast({ title: "Login failed", description: data.message || "Invalid credentials", });
        setLoading(false);
        return;
      }
      
      // Login successful - token is already stored by the API
      toast({ title: "Login successful", description: "Welcome, admin!", });
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast({ title: "Error", description: "An error occurred. Please try again.", });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-coral-100 relative overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-coral/20 rounded-full blur-3xl animate-pulse" style={{ zIndex: 0, animationDelay: "2s" }} />
      <Card className="w-full max-w-md z-10 shadow-xl glass">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Admin Login</CardTitle>
          <CardDescription className="text-center">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@nevyra.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 
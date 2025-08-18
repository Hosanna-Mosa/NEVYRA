import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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

  // Forgot password state
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [otpOpen, setOtpOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [fpLoading, setFpLoading] = React.useState(false);

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

  // Forgot password handlers
  const handleSendOTP = async () => {
    if (!resetEmail) {
      toast({ title: "Email required", description: "Please enter your email." });
      return;
    }
    setFpLoading(true);
    try {
      const res = await adminAPI.forgotPassword({ email: resetEmail });
      if (res.success) {
        toast({ title: "OTP sent", description: res.message || "Check your email for the OTP." });
        setForgotOpen(false);
        setOtpOpen(true);
      } else {
        toast({ title: "Failed", description: res.message || "Could not send OTP" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to send OTP" });
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!resetEmail || !otp) {
      toast({ title: "Required", description: "Email and OTP are required" });
      return;
    }
    setFpLoading(true);
    try {
      const res = await adminAPI.verifyOTP({ email: resetEmail, otp });
      if (res.success) {
        toast({ title: "Verified", description: res.message || "OTP verified." });
        setOtpOpen(false);
        setResetOpen(true);
      } else {
        toast({ title: "Invalid OTP", description: res.message || "Try again" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to verify OTP" });
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !otp || !newPassword) {
      toast({ title: "Required", description: "Please fill all fields" });
      return;
    }
    setFpLoading(true);
    try {
      const res = await adminAPI.resetPassword({ email: resetEmail, otp, newPassword });
      if (res.success) {
        toast({ title: "Password reset", description: res.message || "You can now login." });
        setResetOpen(false);
        setResetEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast({ title: "Failed", description: res.message || "Could not reset password" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to reset password" });
    } finally {
      setFpLoading(false);
    }
  };

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
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Forgot Password - Email Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>Enter your admin email to receive an OTP.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="admin@nevyra.com" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setForgotOpen(false)}>Cancel</Button>
            <Button onClick={handleSendOTP} disabled={fpLoading}>{fpLoading ? "Sending..." : "Send OTP"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify OTP Dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>Enter the 6-digit code sent to your email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">OTP</label>
            <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOtpOpen(false)}>Cancel</Button>
            <Button onClick={handleVerifyOTP} disabled={fpLoading}>{fpLoading ? "Verifying..." : "Verify"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set new password</DialogTitle>
            <DialogDescription>Choose a strong password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">New password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={fpLoading}>{fpLoading ? "Saving..." : "Save password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login; 
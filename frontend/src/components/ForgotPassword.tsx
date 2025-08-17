import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.forgotPassword(email);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setStep("otp");
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
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP sent to your email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.verifyOTP(email, otp);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setStep("reset");
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
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.resetPassword(email, otp, newPassword);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setStep("success");
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
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset OTP"}
            </Button>
          </form>
        );

      case "otp":
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
            </div>
            
            <div>
              <Label htmlFor="otp-input">Enter OTP</Label>
              <Input
                id="otp-input"
                type="text"
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                className="text-sm"
                onClick={handleSendOTP}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        );

      case "reset":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pl-10 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Password Reset Successful!</h3>
            <p className="text-muted-foreground">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Button onClick={onBack} className="w-full">
              Back to Login
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={step === "email" ? onBack : () => setStep(step === "otp" ? "email" : "otp")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <CardTitle className="text-xl">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Enter OTP"}
          {step === "reset" && "Reset Password"}
          {step === "success" && "Success!"}
        </CardTitle>
        
        {step === "email" && (
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a reset code
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;

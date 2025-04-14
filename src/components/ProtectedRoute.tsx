
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  requiredUserType: "consumer" | "provider" | "admin";
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredUserType,
  requireApproval = false
}) => {
  const { user, userType, isLoading, isProviderApproved } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log(`User not authenticated, redirecting to ${requiredUserType}/login`);
    return <Navigate to={`/${requiredUserType}/login`} replace />;
  }

  // Check if user type matches required type
  if (userType !== requiredUserType) {
    console.log(`User type mismatch: Expected ${requiredUserType}, got ${userType}`);
    
    // Special case for admin (you'll need to implement admin detection)
    if (requiredUserType === "admin") {
      // Implement admin check logic here
      return <Navigate to="/" replace />;
    }
    
    // If user exists but type doesn't match, redirect to their appropriate dashboard
    if (userType) {
      console.log(`Redirecting to /${userType}/dashboard`);
      return <Navigate to={`/${userType}/dashboard`} replace />;
    } else {
      // If userType is null but user exists, there might be an issue
      console.log("User exists but type is null, redirecting to home");
      return <Navigate to="/" replace />;
    }
  }

  // For providers, check approval status if required
  if (requiredUserType === "provider" && requireApproval && !isProviderApproved) {
    return (
      <DashboardLayout userType="provider">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
          <div className="flex items-center justify-center mb-4 text-amber-600">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Account Pending Approval</h1>
          <p className="text-center mb-4">
            Your service provider account is currently under review. 
            You'll be notified once your account has been approved.
          </p>
          <div className="flex justify-center">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded max-w-lg">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Our team will verify your submitted documents</li>
                <li>Background checks will be performed for safety</li>
                <li>You'll receive an email notification upon approval</li>
                <li>This process typically takes 1-2 business days</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  console.log(`User has access to ${requiredUserType} route`);
  // Allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;

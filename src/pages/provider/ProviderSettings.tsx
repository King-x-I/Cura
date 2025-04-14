
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import DocumentUpload from "@/components/profile/DocumentUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProviderProfileData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  profile_picture: string | null;
  service_type: string | null;
  experience_years: number | null;
  is_online: boolean;
  govt_id_url: string | null;
  license_url: string | null;
  skills: string | null;
}

const profileSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required for service location" }),
  service_type: z.string().min(1, { message: "Service type is required" }),
  experience_years: z.coerce.number().min(0, { message: "Experience must be a valid number" }).nullable(),
  is_online: z.boolean().optional(),
  skills: z.string().optional().nullable()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const serviceTypeOptions = [
  { value: "driver", label: "Driver" },
  { value: "caretaker", label: "Caretaker" },
  { value: "nanny", label: "Nanny" },
  { value: "house_helper", label: "House Helper" },
  { value: "chef", label: "Chef" },
  { value: "parcel_delivery", label: "Parcel Delivery" }
];

const ProviderSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [govtIdUrl, setGovtIdUrl] = useState<string | null>(null);
  const [licenseUrl, setLicenseUrl] = useState<string | null>(null);
  const [isDriver, setIsDriver] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      service_type: "",
      experience_years: null,
      is_online: false,
      skills: ""
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchProviderProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("provider_details")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          const profileData: ProviderProfileData = {
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            profile_picture: data.profile_picture,
            service_type: data.service_type,
            experience_years: data.experience_years,
            is_online: data.is_online || false,
            govt_id_url: data.govt_id_url,
            license_url: data.license_url,
            skills: data.skills
          };
          
          profileForm.reset({
            full_name: profileData.full_name,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            service_type: profileData.service_type || "",
            experience_years: profileData.experience_years,
            is_online: profileData.is_online,
            skills: profileData.skills
          });
          
          setProfilePicture(profileData.profile_picture);
          setGovtIdUrl(profileData.govt_id_url);
          setLicenseUrl(profileData.license_url);
          setIsDriver(profileData.service_type === "driver");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderProfile();
  }, [user, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if service type has changed to/from driver
      const wasDriver = isDriver;
      const isNowDriver = values.service_type === "driver";
      
      const { error } = await supabase
        .from("provider_details")
        .update({
          full_name: values.full_name,
          phone: values.phone,
          address: values.address,
          profile_picture: profilePicture,
          service_type: values.service_type,
          experience_years: values.experience_years,
          is_online: values.is_online,
          govt_id_url: govtIdUrl,
          license_url: isNowDriver ? licenseUrl : null, // Only keep license if driver
          skills: values.skills
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      setIsDriver(isNowDriver);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = (url: string) => {
    setProfilePicture(url);
  };

  const handleGovtIdUpdate = (url: string) => {
    setGovtIdUrl(url);
  };

  const handleLicenseUpdate = (url: string) => {
    setLicenseUrl(url);
  };

  const handleServiceTypeChange = (value: string) => {
    // Update the service type in the form
    profileForm.setValue("service_type", value);
    
    // Check if the new value is "driver" to show/hide driver-specific fields
    setIsDriver(value === "driver");
  };

  return (
    <DashboardLayout userType="provider">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your provider account settings and profile.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Provider Profile</CardTitle>
                <CardDescription>
                  Update your personal details and service information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex justify-center">
                  <ProfileImageUpload
                    currentImageUrl={profilePicture}
                    userId={user?.id || null}
                    onImageUploaded={handleProfilePictureUpdate}
                  />
                </div>
                
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Email" 
                                {...field} 
                                disabled 
                                className="bg-gray-50" 
                              />
                            </FormControl>
                            <FormDescription>
                              Email cannot be changed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />
                    <h3 className="text-lg font-medium">Service Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="service_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Type</FormLabel>
                            <Select 
                              onValueChange={handleServiceTypeChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="experience_years"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience (years)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Years of experience" 
                                {...field}
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills & Expertise</FormLabel>
                          <FormControl>
                            <Input placeholder="List your relevant skills" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of your key skills related to your service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="is_online"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Availability Status</FormLabel>
                            <FormDescription>
                              When enabled, you're shown as available for bookings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={loading || !profileForm.formState.isDirty}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Identity & Verification</CardTitle>
                <CardDescription>
                  Upload and manage your identification documents and licenses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Government ID</h3>
                  <p className="text-sm text-gray-500">
                    Please upload a valid government-issued ID for verification purposes.
                  </p>
                  <DocumentUpload
                    documentUrl={govtIdUrl}
                    documentType="Government ID"
                    userId={user?.id || null}
                    onDocumentUploaded={handleGovtIdUpdate}
                    allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                    folder="govt_ids"
                  />
                </div>

                <Separator />

                {(isDriver || licenseUrl) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Driver's License</h3>
                    <p className="text-sm text-gray-500">
                      Required for driver services. Please upload a valid driver's license.
                    </p>
                    <DocumentUpload
                      documentUrl={licenseUrl}
                      documentType="Driver's License"
                      userId={user?.id || null}
                      onDocumentUploaded={handleLicenseUpdate}
                      allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                      folder="licenses"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProviderSettings;

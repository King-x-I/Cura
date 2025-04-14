import React, { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload"; 
import DocumentUpload from "@/components/profile/DocumentUpload";

const ProviderSignup = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [governmentId, setGovernmentId] = useState<string | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    idType: "",
    idNumber: "",
    experience: "",
    languages: "",
    skills: "",
    drivingLicenseNumber: "",
    vehicleType: "",
    licenseExpiryDate: "",
    city: "",
    area: "",
    liveLocation: false,
    workingHoursFrom: "",
    workingHoursTo: "",
    bankAccountName: "",
    bankAccountNumber: "",
    ifscCode: "",
    upiId: "",
    termsAccepted: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "serviceType") {
      setServiceType(value);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Mock registration success with our new uploaded data included
    setTimeout(() => {
      toast({
        title: "Registration successful",
        description: "Your service provider account has been created.",
      });
      
      console.log("Registration data:", {
        ...formData,
        profilePicture,
        governmentId,
        drivingLicense: serviceType === "driver" ? drivingLicense : null,
        resume
      });
      
      setLoading(false);
      // In a real implementation, you would redirect to provider dashboard after successful Supabase registration
      localStorage.setItem("cura-user", JSON.stringify({ role: "provider" }));
      window.location.href = "/provider/dashboard";
    }, 2000);
  };

  return (
    <AuthCard
      title="Register as Service Provider"
      description="Fill in the details below to create your service provider account"
      footer={
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/provider/login" className="text-cura-primary font-semibold hover:underline">
            Log in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleInputChange} 
              placeholder="Enter your full name"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {date ? format(date, "PPP") : <span>Select your date of birth</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const eighteenYearsAgo = new Date();
                    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                    return date > eighteenYearsAgo || date < new Date("1940-01-01");
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select onValueChange={(value) => handleSelectChange("gender", value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              type="tel"
              placeholder="Enter your phone number"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              type="email"
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              type="password"
              placeholder="Create a password"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              type="password"
              placeholder="Confirm your password"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <ProfileImageUpload 
              currentImageUrl={profilePicture}
              userId={"signup-" + formData.email}  // Using email as placeholder ID for signup form
              onImageUploaded={url => setProfilePicture(url)}
            />
          </div>
        </div>
        
        {/* Identity Verification */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Identity Verification</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="idType">ID Type *</Label>
            <Select onValueChange={(value) => handleSelectChange("idType", value)} required>
              <SelectTrigger id="idType">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhar">Aadhar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="drivingLicense">Driving License</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="idNumber">ID Number *</Label>
            <Input 
              id="idNumber" 
              name="idNumber" 
              value={formData.idNumber} 
              onChange={handleInputChange} 
              placeholder="Enter your ID number"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Upload Government ID *</Label>
            <DocumentUpload 
              documentUrl={governmentId}
              documentType="Government ID"
              userId={"signup-" + formData.email}  // Using email as placeholder ID for signup form
              onDocumentUploaded={url => setGovernmentId(url)}
              allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              folder="gov_ids"
            />
          </div>
        </div>
        
        {/* Professional Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Professional Details</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="serviceType">Type of Service *</Label>
            <Select onValueChange={(value) => handleSelectChange("serviceType", value)} required>
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="nanny">Nanny</SelectItem>
                <SelectItem value="caretaker">Caretaker</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="houseHelper">House Helper</SelectItem>
                <SelectItem value="parcelDelivery">Parcel Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="experience">Experience (Years) *</Label>
            <Input 
              id="experience" 
              name="experience" 
              value={formData.experience} 
              onChange={handleInputChange} 
              type="number"
              min="0"
              max="50"
              placeholder="Enter years of experience"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Upload Resume or Experience Proof</Label>
            <DocumentUpload 
              documentUrl={resume}
              documentType="Resume"
              userId={"signup-" + formData.email}  // Using email as placeholder ID for signup form
              onDocumentUploaded={url => setResume(url)}
              allowedFileTypes={[".pdf", ".doc", ".docx"]}
              folder="resumes"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="languages">Languages Known</Label>
            <Input 
              id="languages" 
              name="languages" 
              value={formData.languages} 
              onChange={handleInputChange} 
              placeholder="E.g., English, Hindi, Tamil (comma separated)"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="skills">Skills/Certifications</Label>
            <Textarea 
              id="skills" 
              name="skills" 
              value={formData.skills} 
              onChange={handleInputChange} 
              placeholder="List your skills or certifications"
              rows={3}
            />
          </div>
        </div>
        
        {/* Driver-Specific Section */}
        {serviceType === "driver" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Driver-Specific Details</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="drivingLicenseNumber">Driving License Number *</Label>
              <Input 
                id="drivingLicenseNumber" 
                name="drivingLicenseNumber" 
                value={formData.drivingLicenseNumber} 
                onChange={handleInputChange} 
                placeholder="Enter driving license number"
                required 
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Upload Driving License *</Label>
              <DocumentUpload 
                documentUrl={drivingLicense}
                documentType="Driving License"
                userId={"signup-" + formData.email}  // Using email as placeholder ID for signup form
                onDocumentUploaded={url => setDrivingLicense(url)}
                allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                folder="licenses"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select onValueChange={(value) => handleSelectChange("vehicleType", value)} required>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2wheeler">2-wheeler</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
              <Input 
                id="licenseExpiryDate" 
                name="licenseExpiryDate" 
                value={formData.licenseExpiryDate} 
                onChange={handleInputChange} 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
          </div>
        )}
        
        {/* Location & Availability */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-lg">Location & Availability</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="city">Current City *</Label>
            <Input 
              id="city" 
              name="city" 
              value={formData.city} 
              onChange={handleInputChange} 
              placeholder="Enter your city"
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="area">Area/Locality *</Label>
            <Input 
              id="area" 
              name="area" 
              value={formData.area} 
              onChange={handleInputChange} 
              placeholder="Enter your area or locality"
              required 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="liveLocation" 
              checked={formData.liveLocation}
              onCheckedChange={(checked) => handleCheckboxChange("liveLocation", checked)} 
            />
            <Label htmlFor="liveLocation">Allow Live Location Access</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="workingHoursFrom">Working Hours (From)</Label>
              <Input 
                id="workingHoursFrom" 
                name="workingHoursFrom" 
                value={formData.workingHoursFrom} 
                onChange={handleInputChange} 
                type="time"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="workingHoursTo">Working Hours (To)</Label>
              <Input 
                id="workingHoursTo" 
                name="workingHoursTo" 
                value={formData.workingHoursTo} 
                onChange={handleInputChange} 
                type="time"
              />
            </div>
          </div>
        </div>
        
        {/* Bank/Payment Details */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-lg">Bank/Payment Details (Optional)</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="bankAccountName">Account Holder Name</Label>
            <Input 
              id="bankAccountName" 
              name="bankAccountName" 
              value={formData.bankAccountName} 
              onChange={handleInputChange} 
              placeholder="Enter account holder name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
            <Input 
              id="bankAccountNumber" 
              name="bankAccountNumber" 
              value={formData.bankAccountNumber} 
              onChange={handleInputChange} 
              placeholder="Enter account number"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input 
              id="ifscCode" 
              name="ifscCode" 
              value={formData.ifscCode} 
              onChange={handleInputChange} 
              placeholder="Enter IFSC code"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input 
              id="upiId" 
              name="upiId" 
              value={formData.upiId} 
              onChange={handleInputChange} 
              placeholder="Enter UPI ID"
            />
          </div>
        </div>
        
        {/* Final Steps */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="termsAccepted" 
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked === true)} 
            />
            <Label htmlFor="termsAccepted" className="text-sm">
              I agree to the Terms and Conditions and Privacy Policy
            </Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Register as Service Provider"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default ProviderSignup;

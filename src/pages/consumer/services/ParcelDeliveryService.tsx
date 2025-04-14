
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, Loader2, Package, Plus, Minus, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  pickupLocation: z
    .string()
    .min(3, { message: "Please enter a valid pickup location" }),
  dropoffLocation: z
    .string()
    .min(3, { message: "Please enter a valid drop-off location" }),
  date: z
    .date({ required_error: "Please select a date" }),
  timeWindow: z
    .string()
    .min(1, { message: "Please select a time window" }),
  packageType: z
    .string()
    .min(1, { message: "Please select a package type" }),
  isFragile: z
    .boolean()
    .optional()
    .default(false),
  senderName: z
    .string()
    .min(3, { message: "Please enter sender's name" }),
  senderPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  receiverName: z
    .string()
    .min(3, { message: "Please enter receiver's name" }),
  receiverPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
});

const ParcelDeliveryService = () => {
  const [booking, setBooking] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<string[]>(['']);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      timeWindow: "",
      packageType: "",
      isFragile: false,
      senderName: "",
      senderPhone: "",
      receiverName: "",
      receiverPhone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Mock API call to book a parcel delivery
    setTimeout(() => {
      setBooking(true);
      toast.success("Parcel delivery booking requested!");
      setIsLoading(false);
    }, 2000);
  };

  const addPickupLocation = () => {
    setPickupLocations([...pickupLocations, '']);
  };

  const removePickupLocation = (index: number) => {
    if (pickupLocations.length > 1) {
      const newLocations = [...pickupLocations];
      newLocations.splice(index, 1);
      setPickupLocations(newLocations);
    }
  };

  if (booking) {
    return (
      <DashboardLayout userType="consumer">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Finding a Delivery Partner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg">
                We're finding a delivery partner for your parcel
              </p>
              <p className="text-gray-500">
                This won't take long. You'll receive a notification once a delivery partner accepts your request.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg w-full">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="text-blue-500 font-medium">Pickup:</div>
                  <div>{form.getValues("pickupLocation")}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-blue-500 font-medium">Dropoff:</div>
                  <div>{form.getValues("dropoffLocation")}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-blue-500 font-medium">Date:</div>
                  <div>{format(form.getValues("date"), "MMMM d, yyyy")}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-blue-500 font-medium">Time Window:</div>
                  <div>{form.getValues("timeWindow")}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-blue-500 font-medium">Package:</div>
                  <div>{form.getValues("packageType")}{form.getValues("isFragile") ? " (Fragile)" : ""}</div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setBooking(null)}>
              Cancel Request
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="consumer">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book a Parcel Delivery</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Package className="h-5 w-5" /> 
                    Pickup Locations
                  </h3>
                  
                  {pickupLocations.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        {index === 0 ? (
                          <FormField
                            control={form.control}
                            name="pickupLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Location {pickupLocations.length > 1 ? index + 1 : ""}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <Input placeholder="123 Main St, City" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormItem>
                            <FormLabel>Pickup Location {index + 1}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                <Input placeholder="456 Elm St, City" className="pl-10" />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      </div>
                      
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="mt-8"
                          onClick={() => removePickupLocation(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addPickupLocation}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add another pickup location
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="dropoffLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop-off Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                          <Input placeholder="789 Oak St, City" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Delivery Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeWindow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Window</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                            <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small (under 1kg)</SelectItem>
                            <SelectItem value="medium">Medium (1-5kg)</SelectItem>
                            <SelectItem value="large">Large (5-10kg)</SelectItem>
                            <SelectItem value="xl">Extra Large (10kg+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isFragile"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Fragile Package?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Sender & Receiver Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="senderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sender's Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="senderPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sender's Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                <Input className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="receiverName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Receiver's Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="receiverPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Receiver's Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                <Input className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">Price Estimate</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Base fare:</span>
                      <span>$15.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Distance fee (estimated):</span>
                      <span>$10.00</span>
                    </div>
                    {pickupLocations.length > 1 && (
                      <div className="flex justify-between text-sm">
                        <span>Multiple pickup fee ({pickupLocations.length - 1}):</span>
                        <span>${(pickupLocations.length - 1) * 5}.00</span>
                      </div>
                    )}
                    {form.watch("isFragile") && (
                      <div className="flex justify-between text-sm">
                        <span>Fragile handling:</span>
                        <span>$5.00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Service fee:</span>
                      <span>$2.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                      <span>Total (est):</span>
                      <span>
                        ${27 + 
                          (pickupLocations.length - 1) * 5 + 
                          (form.watch("isFragile") ? 5 : 0)
                        }.00
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Book Delivery"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParcelDeliveryService;

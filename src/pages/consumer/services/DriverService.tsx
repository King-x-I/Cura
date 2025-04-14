
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  MapPin, Calendar, Clock, CreditCard, Loader2
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  pickupLocation: z
    .string()
    .min(3, { message: "Please enter a valid pickup location" }),
  dropoffLocation: z
    .string()
    .min(3, { message: "Please enter a valid drop-off location" }),
  date: z
    .date({ required_error: "Please select a date" }),
  time: z
    .string()
    .min(1, { message: "Please select a time" }),
});

const DriverService = () => {
  const [booking, setBooking] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      time: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Mock API call to book a driver
    setTimeout(() => {
      setBooking(true);
      toast.success("Driver booking requested!");
      setIsLoading(false);
    }, 2000);
  };

  if (booking) {
    return (
      <DashboardLayout userType="consumer">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Finding a Driver</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg">
                We're searching for a driver in your area
              </p>
              <p className="text-gray-500">
                This won't take long. You'll receive a notification once a driver accepts your request.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg w-full">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <MapPin size={18} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Pickup</p>
                    <p>{form.getValues("pickupLocation")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin size={18} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Dropoff</p>
                    <p>{form.getValues("dropoffLocation")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p>{format(form.getValues("date"), "MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Clock size={18} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Time</p>
                    <p>{form.getValues("time")}</p>
                  </div>
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
        <h1 className="text-3xl font-bold mb-6">Book a Driver</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="dropoffLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop-off Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                          <Input placeholder="456 Elm St, City" className="pl-10" {...field} />
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
                        <FormLabel>Date</FormLabel>
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
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
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
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <Input type="time" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Estimated Price</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span>Base fare</span>
                      <span>$25.00</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Distance (~5km)</span>
                      <span>$10.00</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Service fee</span>
                      <span>$2.00</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$37.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <CreditCard size={18} />
                  <span>Payment will be collected after the ride</span>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverService;

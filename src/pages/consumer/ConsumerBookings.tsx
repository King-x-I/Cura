
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, HeartPulse, Baby, Home, Package, Utensils, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

// Mock bookings data - in a real app this would come from an API
const mockBookings = [
  {
    id: "book-1",
    serviceType: "Driver",
    icon: Car,
    date: "2025-04-08",
    time: "14:30",
    status: "confirmed",
    location: "123 Main St, City",
    providerName: "John Driver"
  },
  {
    id: "book-2",
    serviceType: "Caretaker",
    icon: HeartPulse,
    date: "2025-04-09",
    time: "10:00",
    status: "pending",
    location: "45 Park Ave, City",
    providerName: "Pending Assignment"
  },
  {
    id: "book-3",
    serviceType: "Nanny",
    icon: Baby,
    date: "2025-04-10",
    time: "08:00",
    status: "in-progress",
    location: "87 Oak Street, City",
    providerName: "Mary Nanny"
  }
];

// Status badge colors
const statusColors = {
  pending: "yellow",
  confirmed: "green",
  "in-progress": "blue",
  cancelled: "red"
};

const ConsumerBookings = () => {
  const handleCancel = (id: string) => {
    toast.success(`Booking ${id} cancelled`);
    // In a real app, you would make an API call to cancel the booking
  };

  const handleTrack = (id: string) => {
    toast.info(`Tracking booking ${id}`);
    // In a real app, you would navigate to a tracking page or open a modal
  };

  const getStatusBadge = (status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || "gray";
    
    return (
      <Badge className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout userType="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Bookings</h1>
          <p className="text-gray-600">Track and manage your active service bookings.</p>
        </div>

        {mockBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-lg text-gray-500 mb-4">You don't have any active bookings</p>
              <Button variant="outline" onClick={() => window.location.href = "/consumer/dashboard"}>
                Book a Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockBookings.map((booking) => {
              const BookingIcon = booking.icon;
              
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="pb-2 flex flex-row items-center">
                    <div className="flex items-center flex-1">
                      <div className="mr-3 p-2 rounded-full bg-primary/10">
                        <BookingIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{booking.serviceType} Service</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin size={14} />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock size={14} className="mr-2 text-gray-500" />
                          <span>
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Provider:</span> {booking.providerName}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={booking.status === "in-progress"}
                        >
                          Cancel
                        </Button>
                        {booking.status !== "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleTrack(booking.id)}
                          >
                            Track
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConsumerBookings;

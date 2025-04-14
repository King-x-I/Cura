
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check, X } from "lucide-react";

const ProviderBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([
    {
      id: "book-1",
      customer: "Alex Johnson",
      service: "Driver Service",
      date: "Today, 2:30 PM",
      address: "123 Main St, Anytown",
      status: "Upcoming"
    },
    {
      id: "book-2",
      customer: "Emma Wilson",
      service: "Driver Service",
      date: "Tomorrow, 10:00 AM",
      address: "456 Elm St, Anytown",
      status: "Accepted"
    },
    {
      id: "book-3",
      customer: "Michael Brown",
      service: "Driver Service",
      date: "Yesterday, 4:00 PM",
      address: "789 Oak St, Anytown",
      status: "Completed"
    },
    {
      id: "book-4",
      customer: "Sophia Garcia",
      service: "Driver Service",
      date: "22 Apr, 1:15 PM",
      address: "101 Pine St, Anytown",
      status: "Declined"
    }
  ]);

  const handleAcceptBooking = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: "Accepted" } : booking
    ));
    
    toast({
      title: "Booking accepted",
      description: "The customer has been notified of your acceptance.",
    });
    
    // In a real app with Supabase, you would update the booking status in the database:
    // await supabase.from('bookings').update({ status: 'Accepted' }).eq('id', bookingId);
    // And then send a notification to the customer
  };

  const handleDeclineBooking = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: "Declined" } : booking
    ));
    
    toast({
      title: "Booking declined",
      description: "The customer has been notified that you can't accept this booking.",
      variant: "destructive"
    });
    
    // In a real app with Supabase:
    // await supabase.from('bookings').update({ status: 'Declined' }).eq('id', bookingId);
    // And then send a notification to the customer
  };

  const handleViewDetails = (bookingId: string) => {
    toast({
      title: "Viewing booking details",
      description: `Details for booking ${bookingId} will be displayed`,
    });
    
    // In a real app, this would open a modal or navigate to a details page
    // navigate(`/provider/bookings/${bookingId}`);
  };

  // Define filter tabs for the bookings
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredBookings = activeFilter === "all" 
    ? bookings
    : bookings.filter(booking => 
        activeFilter === "upcoming" 
          ? booking.status === "Upcoming" 
          : activeFilter === "accepted" 
            ? booking.status === "Accepted" 
            : activeFilter === "completed"
              ? booking.status === "Completed"
              : booking.status === "Declined"
      );

  return (
    <DashboardLayout userType="provider">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-gray-600">Manage all your service bookings</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="text-sm"
          >
            All Bookings
          </Button>
          <Button 
            variant={activeFilter === "upcoming" ? "default" : "outline"}
            onClick={() => setActiveFilter("upcoming")}
            className="text-sm"
          >
            Upcoming
          </Button>
          <Button 
            variant={activeFilter === "accepted" ? "default" : "outline"}
            onClick={() => setActiveFilter("accepted")}
            className="text-sm"
          >
            Accepted
          </Button>
          <Button 
            variant={activeFilter === "completed" ? "default" : "outline"}
            onClick={() => setActiveFilter("completed")}
            className="text-sm"
          >
            Completed
          </Button>
          <Button 
            variant={activeFilter === "declined" ? "default" : "outline"}
            onClick={() => setActiveFilter("declined")}
            className="text-sm"
          >
            Declined
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeFilter === "all" ? "All Bookings" : 
               activeFilter === "upcoming" ? "Upcoming Bookings" :
               activeFilter === "accepted" ? "Accepted Bookings" :
               activeFilter === "completed" ? "Completed Bookings" : 
               "Declined Bookings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="group">
                      <TableCell className="font-medium">{booking.customer}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.address}</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === "Upcoming" ? "outline" :
                          booking.status === "Accepted" ? "default" :
                          booking.status === "Completed" ? "secondary" :
                          "destructive"
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.status === "Upcoming" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeclineBooking(booking.id)}
                              >
                                <X size={16} className="mr-1" />
                                Decline
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleAcceptBooking(booking.id)}
                              >
                                <Check size={16} className="mr-1" />
                                Accept
                              </Button>
                            </>
                          )}
                          {(booking.status === "Accepted" || booking.status === "Completed" || booking.status === "Declined") && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(booking.id)}
                            >
                              <Eye size={16} className="mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings found in this category</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProviderBookings;

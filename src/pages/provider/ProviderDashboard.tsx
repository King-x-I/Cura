
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [bookings, setBookings] = useState([
    {
      id: "book-1",
      customer: "Alex Johnson",
      service: "Driver Service",
      date: "Today, 2:30 PM",
      address: "123 Main St, Anytown",
      status: "upcoming"
    },
    {
      id: "book-2",
      customer: "Emma Wilson",
      service: "Driver Service",
      date: "Tomorrow, 10:00 AM",
      address: "456 Elm St, Anytown",
      status: "upcoming"
    }
  ]);

  // Stats for the dashboard
  const stats = [
    {
      title: "Total Bookings",
      value: "5",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      link: "/provider/bookings"
    },
    {
      title: "Next Booking",
      value: "2h 15m",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      link: "#upcoming-bookings"
    },
    {
      title: "Earnings",
      value: "$320",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
      link: "/provider/earnings"
    },
    {
      title: "Rating",
      value: "4.8",
      icon: Star,
      color: "bg-purple-100 text-purple-600",
      link: "/provider/reviews"
    }
  ];

  const handleAvailabilityChange = (checked: boolean) => {
    setIsOnline(checked);
    toast({
      title: checked ? "You are now online" : "You are now offline",
      description: checked 
        ? "You will now receive booking requests." 
        : "You won't receive new booking requests.",
    });
    
    // In a real app, update the status in Supabase
    // supabase.from('providers').update({ status: checked ? 'online' : 'offline' })
    //   .eq('id', providerId)
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: "accepted" } : booking
    ));
    
    toast({
      title: "Booking accepted",
      description: "The customer has been notified.",
    });
    
    // In a real app, update the booking status in Supabase
    // supabase.from('bookings').update({ status: 'accepted' })
    //   .eq('id', bookingId)
  };

  const handleDeclineBooking = (bookingId: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: "declined" } : booking
    ));
    
    toast({
      title: "Booking declined",
      description: "The customer has been notified.",
      variant: "destructive"
    });
    
    // In a real app, update the booking status in Supabase
    // supabase.from('bookings').update({ status: 'declined' })
    //   .eq('id', bookingId)
  };

  return (
    <DashboardLayout userType="provider">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
            <p className="text-gray-600">Manage your services and bookings</p>
          </div>
          
          {/* Availability Toggle */}
          <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2">
              <Switch 
                id="availability" 
                checked={isOnline}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="availability" className="font-medium">
                {isOnline ? "Online" : "Offline"}
              </Label>
            </div>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {/* Stats - Now clickable with navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link to={stat.link} key={stat.title} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.color}`}>
                    <stat.icon size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Upcoming bookings with functional buttons */}
        <div className="space-y-4" id="upcoming-bookings">
          <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className={`border-l-4 ${
                    booking.status === 'accepted' ? 'border-green-500' : 
                    booking.status === 'declined' ? 'border-red-500' : 
                    'border-indigo-500'
                  } h-full`}>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.service}</h3>
                          <p className="text-gray-500">{booking.customer}</p>
                          <p className="text-gray-500">{booking.date}</p>
                          <p className="text-gray-500">{booking.address}</p>
                          {booking.status === 'accepted' && (
                            <div className="mt-2 text-sm font-medium text-green-600">Accepted</div>
                          )}
                          {booking.status === 'declined' && (
                            <div className="mt-2 text-sm font-medium text-red-600">Declined</div>
                          )}
                        </div>
                        {booking.status === 'upcoming' && (
                          <div className="flex gap-3 mt-4 sm:mt-0">
                            <Button 
                              variant="outline" 
                              onClick={() => handleDeclineBooking(booking.id)}
                            >
                              Decline
                            </Button>
                            <Button 
                              onClick={() => handleAcceptBooking(booking.id)}
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                        {booking.status === 'accepted' && (
                          <Button variant="outline">
                            Contact Customer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">No upcoming bookings</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;


import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, HeartPulse, Baby, Clock, CalendarDays, Download, Star } from "lucide-react";
import { toast } from "sonner";

// Mock history data - in a real app this would come from an API
const mockHistory = [
  {
    id: "hist-1",
    serviceType: "Driver",
    icon: Car,
    date: "2025-04-02",
    time: "10:00",
    status: "completed",
    providerName: "John Driver",
    amount: 35.00,
    rated: true,
    rating: 4
  },
  {
    id: "hist-2",
    serviceType: "Caretaker",
    icon: HeartPulse,
    date: "2025-04-01",
    time: "14:00",
    status: "completed",
    providerName: "Sarah Care",
    amount: 75.00,
    rated: false
  },
  {
    id: "hist-3",
    serviceType: "Nanny",
    icon: Baby,
    date: "2025-03-28",
    time: "09:30",
    status: "cancelled",
    providerName: "Mary Nanny",
    amount: 0.00,
    rated: false
  }
];

const ConsumerHistory = () => {
  const handleDownloadInvoice = (id: string) => {
    toast.success(`Invoice for booking ${id} is being downloaded`);
    // In a real app, you would generate and download a PDF invoice
  };

  const handleRateService = (id: string) => {
    toast.info(`Rate your experience for booking ${id}`);
    // In a real app, you would open a rating modal or navigate to a rating page
  };

  return (
    <DashboardLayout userType="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking History</h1>
          <p className="text-gray-600">View your past bookings and service history.</p>
        </div>

        {mockHistory.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-lg text-gray-500">No booking history yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockHistory.map((booking) => {
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
                          <CalendarDays size={14} />
                          <span>
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={booking.status === "completed" ? "default" : "destructive"}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Provider:</span> {booking.providerName}
                        </div>
                        {booking.status === "completed" && (
                          <div className="text-sm">
                            <span className="font-medium">Amount:</span> ${booking.amount.toFixed(2)}
                          </div>
                        )}
                        {booking.rated && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">Your rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < (booking.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end items-center">
                        {booking.status === "completed" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(booking.id)}
                            >
                              <Download size={14} className="mr-1" /> Invoice
                            </Button>
                            {!booking.rated && (
                              <Button
                                size="sm"
                                onClick={() => handleRateService(booking.id)}
                              >
                                <Star size={14} className="mr-1" /> Rate
                              </Button>
                            )}
                          </>
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

export default ConsumerHistory;

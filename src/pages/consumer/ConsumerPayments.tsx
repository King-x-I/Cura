
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, CreditCard, Check, AlertCircle, RefreshCw } from "lucide-react";

// Mock payment data - in a real app this would come from an API
const mockPayments = [
  {
    id: "pay-1",
    serviceType: "Driver Service",
    date: "2025-04-02",
    time: "10:05",
    amount: 35.00,
    paymentMethod: "Credit Card",
    status: "successful",
    receiptUrl: "#"
  },
  {
    id: "pay-2",
    serviceType: "Caretaker",
    date: "2025-04-01",
    time: "14:10",
    amount: 75.00,
    paymentMethod: "UPI",
    status: "successful",
    receiptUrl: "#"
  },
  {
    id: "pay-3",
    serviceType: "Chef Service",
    date: "2025-03-28",
    time: "18:30",
    amount: 120.00,
    paymentMethod: "Credit Card",
    status: "failed",
    receiptUrl: null
  },
  {
    id: "pay-4",
    serviceType: "House Helper",
    date: "2025-03-25",
    time: "09:15",
    amount: 50.00,
    paymentMethod: "UPI",
    status: "refunded",
    receiptUrl: "#"
  }
];

// Status icon mapping
const statusIcons = {
  successful: <Check className="h-4 w-4 text-green-500" />,
  failed: <AlertCircle className="h-4 w-4 text-red-500" />,
  refunded: <RefreshCw className="h-4 w-4 text-amber-500" />
};

// Status badge variants
const statusVariants = {
  successful: "success",
  failed: "destructive",
  refunded: "warning"
};

const ConsumerPayments = () => {
  const getStatusBadge = (status: string) => {
    const icon = statusIcons[status as keyof typeof statusIcons] || null;
    const variant = statusVariants[status as keyof typeof statusVariants] || "default";
    
    return (
      <Badge variant={variant as any} className="flex items-center gap-1">
        {icon}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </Badge>
    );
  };

  return (
    <DashboardLayout userType="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-gray-600">View your payment history and receipts.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date & Time</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Method</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3 px-4">
                        {payment.serviceType}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={14} />
                          <span>{new Date(payment.date).toLocaleDateString()} {payment.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} className="text-gray-500" />
                          <span>{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {payment.receiptUrl && (
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Download size={14} />
                            Receipt
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex items-center">
                <CreditCard className="h-8 w-8 text-gray-400 mr-4" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 04/26</p>
                </div>
              </div>
              <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsumerPayments;

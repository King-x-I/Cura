
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceCard } from "@/components/consumer/ServiceCard";
import { Car, HeartPulse, Baby, Home, Package, Utensils } from "lucide-react";

const ConsumerDashboard = () => {
  const services = [
    {
      title: "Driver Service",
      description: "Book a driver on rent",
      icon: Car,
      href: "/consumer/services/driver",
      color: "indigo"
    },
    {
      title: "Caretaker",
      description: "Elderly, medical or babysitting",
      icon: HeartPulse,
      href: "/consumer/services/caretaker",
      color: "emerald"
    },
    {
      title: "Nanny",
      description: "Childcare services for all ages",
      icon: Baby,
      href: "/consumer/services/nanny",
      color: "amber"
    },
    {
      title: "House Helper",
      description: "Cleaning, cooking & more",
      icon: Home,
      href: "/consumer/services/house-helper",
      color: "rose"
    },
    {
      title: "Chef",
      description: "Professional cooking services",
      icon: Utensils,
      href: "/consumer/services/chef",
      color: "blue"
    },
    {
      title: "Parcel Delivery",
      description: "Fast & reliable delivery",
      icon: Package,
      href: "/consumer/services/parcel-delivery",
      color: "purple"
    }
  ];

  // The user name could later be fetched from an auth context
  const userName = "User";

  return (
    <DashboardLayout userType="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Book trusted services with just a few clicks.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard 
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConsumerDashboard;

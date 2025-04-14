
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export function ServiceCard({ title, description, icon: Icon, href, color }: ServiceCardProps) {
  const iconColors: Record<string, string> = {
    indigo: "text-indigo-500 bg-indigo-100",
    emerald: "text-emerald-500 bg-emerald-100",
    amber: "text-amber-500 bg-amber-100",
    rose: "text-rose-500 bg-rose-100",
    blue: "text-blue-500 bg-blue-100",
    purple: "text-purple-500 bg-purple-100",
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-500">
        Available in your area
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={href}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

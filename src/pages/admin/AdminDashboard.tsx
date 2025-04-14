
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AdminDashboard = () => {
  return (
    <DashboardLayout userType="admin">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard. Use the navigation to manage the system.</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ProviderDetails {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  experience_years: number;
  govt_id_url: string;
  resume_url: string;
  license_url?: string;
  created_at: string;
}

const AdminProviderApprovals = () => {
  const [pendingProviders, setPendingProviders] = useState<ProviderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_details')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingProviders(data || []);
    } catch (error) {
      console.error('Error fetching pending providers:', error);
      toast.error('Failed to load pending providers');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('provider_details')
        .update({ is_approved: approve })
        .eq('id', providerId);

      if (error) throw error;

      // Create notification for the provider
      await supabase.from('notifications').insert({
        user_id: providerId,
        message: approve 
          ? 'Congratulations! Your account has been approved. You can now start accepting service requests.'
          : 'Your account application has been rejected. Please contact support for more information.',
      });

      toast.success(
        approve ? 'Provider approved successfully!' : 'Provider rejected successfully!'
      );
      
      // Refresh the list
      fetchPendingProviders();
    } catch (error) {
      console.error('Error approving/rejecting provider:', error);
      toast.error('Failed to process approval/rejection');
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Provider Approvals</h1>
        
        {loading ? (
          <p>Loading pending approvals...</p>
        ) : pendingProviders.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium text-gray-700">No pending approvals</h3>
            <p className="text-gray-500 mt-2">All provider applications have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{provider.full_name}</h3>
                        <p className="text-gray-500">{provider.service_type} • {provider.experience_years} years experience</p>
                      </div>
                      
                      <div className="grid gap-1 text-sm">
                        <p><span className="font-medium">Email:</span> {provider.email}</p>
                        <p><span className="font-medium">Phone:</span> {provider.phone || 'Not provided'}</p>
                        <p><span className="font-medium">Applied:</span> {new Date(provider.created_at).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {provider.govt_id_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(provider.govt_id_url, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            View ID
                          </Button>
                        )}
                        
                        {provider.resume_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(provider.resume_url, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            View Resume
                          </Button>
                        )}
                        
                        {provider.license_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(provider.license_url, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            View License
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-3 justify-end">
                      <Button
                        onClick={() => handleApproval(provider.id, true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </Button>
                      
                      <Button
                        onClick={() => handleApproval(provider.id, false)}
                        variant="outline"
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle size={18} />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminProviderApprovals;

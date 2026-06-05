'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Request {
  id: number;
  user_id: number;
  alias: string;
  email: string;
  first_name: string;
  last_name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface GroupRequestsManagerProps {
  groupId: number;
  canManage: boolean;
}

export default function GroupRequestsManager({ groupId, canManage }: GroupRequestsManagerProps) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (canManage) {
      fetchRequests();
    }
  }, [groupId, canManage]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}/requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`/api/groups/${groupId}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          action: 'approve'
        })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Solicitud aprobada'
        });
        fetchRequests();
      } else {
        toast({
          title: 'Error',
          description: 'Error al aprobar solicitud',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`/api/groups/${groupId}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          action: 'reject'
        })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Solicitud rechazada'
        });
        fetchRequests();
      } else {
        toast({
          title: 'Error',
          description: 'Error al rechazar solicitud',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (!canManage) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader className="animate-spin" size={24} />
        </CardContent>
      </Card>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-lg">
          Solicitudes de Entrada ({pendingRequests.length})
        </h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Solicitudes Pendientes */}
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay solicitudes pendientes
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Pendientes</h4>
            {pendingRequests.map(request => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {request.first_name} {request.last_name}
                    </p>
                    <p className="text-sm text-gray-600">@{request.alias}</p>
                    <p className="text-sm text-gray-500">{request.email}</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    Pendiente
                  </Badge>
                </div>

                {request.message && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-700">{request.message}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Solicitado: {new Date(request.created_at).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === request.id ? (
                      <Loader className="animate-spin mr-2" size={16} />
                    ) : (
                      <CheckCircle size={16} className="mr-2" />
                    )}
                    Aprobar
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-300"
                  >
                    {processingId === request.id ? (
                      <Loader className="animate-spin mr-2" size={16} />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Solicitudes Procesadas */}
        {processedRequests.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-semibold text-gray-900">Procesadas</h4>
            {processedRequests.map(request => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {request.first_name} {request.last_name}
                    </p>
                    <p className="text-sm text-gray-600">@{request.alias}</p>
                  </div>
                  <Badge
                    variant={request.status === 'approved' ? 'default' : 'destructive'}
                  >
                    {request.status === 'approved' ? '✓ Aprobada' : '✗ Rechazada'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

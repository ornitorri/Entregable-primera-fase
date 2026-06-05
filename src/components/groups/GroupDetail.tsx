'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Plus, Send, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface GroupDetailProps {
  groupId: number;
}

interface GroupData {
  id: number;
  name: string;
  description: string;
  topic: string;
  cover_image?: string;
  creator_alias: string;
  member_count: number;
  created_at: string;
  members: any[];
}

interface Message {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  alias: string;
}

export default function GroupDetail({ groupId }: GroupDetailProps) {
  const { toast } = useToast();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [joinRequest, setJoinRequest] = useState<any>(null);

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data.data);
        // Verificar si el usuario actual es miembro
        checkMembership();
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/messages?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const checkMembership = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (response.ok) {
        const data = await response.json();
        const currentUserId = await getCurrentUserId();
        const isMemberCheck = data.data.members?.some((m: any) => m.user_id === currentUserId);
        setIsMember(isMemberCheck || false);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const getCurrentUserId = async () => {
    // Esta función obtendría el usuario actual del contexto o JWT
    // Por ahora, retorna null como placeholder
    return null;
  };

  const handleJoinRequest = async () => {
    if (!requestMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor escribe un mensaje para tu solicitud',
        variant: 'destructive'
      });
      return;
    }

    try {
      setJoinLoading(true);
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: requestMessage })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Solicitud de entrada enviada'
        });
        setJoinRequest(true);
        setRequestMessage('');
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Error al enviar solicitud',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Error al enviar mensaje',
        variant: 'destructive'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (!group) {
    return <div className="text-center py-12 text-red-500">Grupo no encontrado</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      {/* Portada del Grupo */}
      {group.cover_image && (
        <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={group.cover_image}
            alt={group.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Información del Grupo */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{group.name}</h1>
          <Badge className="mt-2">{group.topic}</Badge>
        </div>

        <p className="text-gray-600 text-lg">{group.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{group.member_count} miembros</span>
          </div>
          <span>Creado por: <strong>{group.creator_alias}</strong></span>
        </div>
      </div>

      {/* Panel de Entrada */}
      {!isMember && !joinRequest && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">¿Interesado en unirte?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Envía una solicitud para unirte a este grupo. Un administrador la revisará.
            </p>
            <div className="space-y-3">
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Cuéntanos por qué deseas unirte a este grupo (opcional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleJoinRequest}
                disabled={joinLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {joinLoading && <Loader className="animate-spin mr-2" size={18} />}
                Solicitar Entrada
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {joinRequest && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Solicitud Enviada</p>
              <p className="text-sm text-gray-600">Un administrador revisará tu solicitud pronto</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Miembros del Grupo */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-lg">Miembros ({group.members.length})</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {group.members.map((member: any) => (
              <div key={member.id} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="font-bold">{member.alias[0]}</span>
                </div>
                <p className="text-sm font-medium truncate">{member.alias}</p>
                {member.role === 'admin' && (
                  <Badge variant="secondary" className="text-xs mt-1">Admin</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat del Grupo */}
      {isMember && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-lg">Conversación</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mensajes */}
            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">Sin mensajes aún</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="bg-white p-3 rounded">
                    <p className="font-medium text-sm">{msg.alias}</p>
                    <p className="text-sm text-gray-700 mt-1">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input de Mensaje */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendingMessage ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

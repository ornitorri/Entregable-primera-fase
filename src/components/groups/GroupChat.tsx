'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader, Send, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GroupChatProps {
  groupId: number;
  isMember: boolean;
}

interface Message {
  id: number;
  user_id: number;
  message: string;
  image_data?: string;
  created_at: string;
  alias: string;
}

export default function GroupChat({ groupId, isMember }: GroupChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    getCurrentUser();
    fetchMessages();
    // Recargar mensajes cada 3 segundos
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    // Solo hacer scroll si hay mensajes nuevos y usuario está al fondo
    if (messages.length > lastMessageCountRef.current) {
      lastMessageCountRef.current = messages.length;
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'La imagen no debe superar 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}/messages?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() && !selectedImage) {
      toast({
        title: 'Error',
        description: 'Escribe un mensaje o selecciona una imagen',
        variant: 'destructive',
      });
      return;
    }

    setSendingMessage(true);

    try {
      let imageBase64 = null;
      if (selectedImage) {
        imageBase64 = imagePreview;
      }

      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage || '📷 Imagen compartida',
          image: imageBase64,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        removeImage();
        // Recargar mensajes inmediatamente
        fetchMessages();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al enviar el mensaje',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  if (!isMember) {
    return (
      <Card className="p-8 text-center bg-white/[0.02] border-white/5">
        <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
        <p className="text-white/60 text-sm">Debes unirte al grupo para ver los mensajes</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Área de mensajes */}
      <Card className="bg-white/[0.02] border-white/5 p-6 h-96 overflow-y-auto rounded-2xl">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-accent w-6 h-6" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No hay mensajes aún. ¡Sé el primero en escribir!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.user_id === currentUserId
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  {msg.user_id !== currentUserId && (
                    <p className="text-[10px] font-bold text-white/50 mb-1">
                      {msg.alias || 'Usuario'}
                    </p>
                  )}
                  {msg.image_data && (
                    <img 
                      src={msg.image_data} 
                      alt="mensaje-imagen" 
                      className="mb-2 rounded max-w-xs max-h-64 object-cover"
                    />
                  )}
                  {msg.message && (
                    <p className="text-sm break-words">{msg.message}</p>
                  )}
                  <p className="text-[10px] text-white/30 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      {/* Formulario para enviar mensaje */}
      <div className="space-y-3">
        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-lg border border-accent/30"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            title="Agregar imagen"
          >
            <ImageIcon className="w-5 h-5 text-accent" />
          </button>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={sendingMessage}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <Button
            type="submit"
            disabled={sendingMessage || (!newMessage.trim() && !selectedImage)}
            className="bg-accent hover:bg-accent/80 text-white"
          >
            {sendingMessage ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

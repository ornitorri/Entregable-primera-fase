'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader, Send, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAuthToken } from '@/lib/clientAuth';

interface DirectChatProps {
  otherUserId: number;
  otherUserName?: string;
  onMessageSent?: () => void;
}

interface Message {
  id: number;
  senderId: number;
  message: string;
  imageData?: string;
  createdAt: string;
  alias: string;
}

export default function DirectChat({ otherUserId, otherUserName, onMessageSent }: DirectChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const lastMessageIdRef = useRef<number | null>(null);

  useEffect(() => {
    shouldStickToBottomRef.current = true;
    lastMessageIdRef.current = null;
    getCurrentUser();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  const handleMessagesScroll = () => {
    shouldStickToBottomRef.current = isNearBottom();
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const hasNewMessage = lastMessageIdRef.current !== lastMessage.id;
    const isInitialLoad = lastMessageIdRef.current === null;

    lastMessageIdRef.current = lastMessage.id;

    if (isInitialLoad || (hasNewMessage && shouldStickToBottomRef.current)) {
      requestAnimationFrame(() => scrollToBottom(isInitialLoad ? 'instant' : 'smooth'));
    }
  }, [messages]);

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
      const token = getAuthToken();
      const response = await fetch(`/api/messages/${otherUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      const token = getAuthToken();
      const response = await fetch(`/api/messages/${otherUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: newMessage || '📷 Imagen compartida',
          image: imagePreview,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        removeImage();
        shouldStickToBottomRef.current = true;
        await fetchMessages();
        requestAnimationFrame(() => scrollToBottom('smooth'));
        onMessageSent?.();
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

  return (
    <div className="flex flex-col h-full">
      <Card
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 bg-white/[0.02] border-white/5 p-6 overflow-y-auto rounded-2xl min-h-[400px] max-h-[calc(100vh-320px)]"
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-accent w-6 h-6" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <p className="text-white/40 text-sm">
              Inicia la conversación con {otherUserName || 'este usuario'}
            </p>
            <p className="text-white/20 text-xs">Los mensajes se actualizan en tiempo real</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    msg.senderId === currentUserId
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  {msg.senderId !== currentUserId && (
                    <p className="text-[10px] font-bold text-white/50 mb-1">
                      {msg.alias || 'Usuario'}
                    </p>
                  )}
                  {msg.imageData && (
                    <img
                      src={msg.imageData}
                      alt="Imagen"
                      className="mb-2 rounded-lg max-w-full max-h-64 object-cover"
                    />
                  )}
                  {msg.message && msg.message !== '📷 Imagen compartida' && (
                    <p className="text-sm break-words">{msg.message}</p>
                  )}
                  {msg.message === '📷 Imagen compartida' && !msg.imageData && (
                    <p className="text-sm break-words">{msg.message}</p>
                  )}
                  <p className="text-[10px] text-white/30 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-3 mt-4">
        {imagePreview && (
          <div className="relative inline-block">
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
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all shrink-0"
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
            className="bg-accent hover:bg-accent/80 text-white shrink-0"
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

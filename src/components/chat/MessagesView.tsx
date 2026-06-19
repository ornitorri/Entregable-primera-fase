'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DirectChat from '@/components/chat/DirectChat';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Search, Loader, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAuthToken } from '@/lib/clientAuth';

interface Conversation {
  otherUserId: number;
  alias: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isOwnLastMessage: boolean;
}

interface SearchUser {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

interface MessagesViewProps {
  initialUserId?: number;
}

function UserAvatar({ src, name, size = 'md' }: { src?: string; name: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  if (src) {
    return (
      <img src={src} alt={name} className={cn(sizeClass, 'rounded-full object-cover border border-white/10')} />
    );
  }
  return (
    <div className={cn(sizeClass, 'rounded-full bg-accent/20 flex items-center justify-center border border-white/10')}>
      <User className={size === 'sm' ? 'w-4 h-4 text-accent' : 'w-5 h-5 text-accent'} />
    </div>
  );
}

function displayName(user: { alias?: string; firstName?: string; lastName?: string }) {
  if (user.alias) return user.alias;
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Usuario';
}

export default function MessagesView({ initialUserId }: MessagesViewProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(initialUserId ?? null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/messages', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
    }
  }, [initialUserId]);

  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUserName('');
      return;
    }
    const conv = conversations.find((c) => c.otherUserId === selectedUserId);
    if (conv) {
      setSelectedUserName(displayName(conv));
      return;
    }

    const loadUser = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`/api/messages/${selectedUserId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          if (data.otherUser) {
            setSelectedUserName(displayName(data.otherUser));
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, [selectedUserId, conversations]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const token = getAuthToken();
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data || []);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectUser = (userId: number, name: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/mensajes/${userId}`, { scroll: false });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return date.toLocaleDateString('es-ES', { weekday: 'short' });
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20">
      <Navigation activeTab="comunidad" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-playfair font-black text-white">
              Mensajes
            </h1>
            {totalUnread > 0 && (
              <Badge className="bg-accent text-white border-none">{totalUnread} nuevos</Badge>
            )}
          </div>
          <p className="text-white/40 text-sm italic">
            Chatea en tiempo real con otros lectores de la comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
          {/* Lista de conversaciones */}
          <Card className="md:col-span-4 bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Buscar usuario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
                />
              </div>
              {searching && (
                <div className="flex items-center gap-2 text-white/40 text-xs px-1">
                  <Loader className="w-3 h-3 animate-spin" /> Buscando...
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user.id, displayName(user))}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left"
                    >
                      <UserAvatar src={user.avatarUrl} name={displayName(user)} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{displayName(user)}</p>
                        <p className="text-[10px] text-white/40">Iniciar conversación</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-16">
                  <Loader className="animate-spin text-accent w-6 h-6" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-16 px-6 space-y-2">
                  <MessageCircle className="w-10 h-10 text-white/10 mx-auto" />
                  <p className="text-white/40 text-sm">No tienes conversaciones aún</p>
                  <p className="text-white/20 text-xs">Busca un usuario arriba para empezar</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {conversations.map((conv) => (
                    <button
                      key={conv.otherUserId}
                      onClick={() => selectUser(conv.otherUserId, displayName(conv))}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                        selectedUserId === conv.otherUserId
                          ? 'bg-accent/10 border border-accent/20'
                          : 'hover:bg-white/5'
                      )}
                    >
                      <UserAvatar src={conv.avatarUrl} name={displayName(conv)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-white truncate">
                            {displayName(conv)}
                          </p>
                          <span className="text-[10px] text-white/30 shrink-0">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs text-white/40 truncate">
                            {conv.isOwnLastMessage ? 'Tú: ' : ''}
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-accent text-white text-[9px] h-5 min-w-5 p-0 flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Área de chat */}
          <Card className="md:col-span-8 bg-white/[0.02] border-white/5 rounded-[2rem] p-6 flex flex-col min-h-[500px]">
            {selectedUserId ? (
              <>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/5">
                  {(() => {
                    const conv = conversations.find((c) => c.otherUserId === selectedUserId);
                    return (
                      <>
                        <UserAvatar
                          src={conv?.avatarUrl}
                          name={selectedUserName}
                        />
                        <div>
                          <p className="font-bold text-white">{selectedUserName}</p>
                          <p className="text-[10px] text-accent/60 uppercase tracking-widest font-black">
                            En línea · actualización cada 3s
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <DirectChat
                  otherUserId={selectedUserId}
                  otherUserName={selectedUserName}
                  onMessageSent={fetchConversations}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-white/20" />
                </div>
                <div className="space-y-1">
                  <p className="text-white/60 font-bold">Selecciona una conversación</p>
                  <p className="text-white/30 text-sm max-w-xs">
                    Elige un chat de la lista o busca un usuario para enviarle un mensaje
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}

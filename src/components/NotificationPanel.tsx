
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  AtSign, 
  Users, 
  BookOpen, 
  Check, 
  MoreHorizontal,
  X
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'mention' | 'group' | 'system' | 'message';
  title: string;
  content: string;
  related_user_id?: number;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  like: { icon: Heart, color: 'text-amber', label: 'Me gusta' },
  comment: { icon: MessageSquare, color: 'text-sage', label: 'Comentario' },
  mention: { icon: AtSign, color: 'text-rust', label: 'Mención' },
  group: { icon: Users, color: 'text-primary', label: 'Grupo' },
  system: { icon: BookOpen, color: 'text-amber', label: 'Sistema' },
  message: { icon: MessageSquare, color: 'text-sage', label: 'Mensaje' }
};

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 7) return `hace ${days}d`;
  
  return date.toLocaleDateString('es-CO');
}

export default function NotificationPanel({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        console.warn('No token disponible');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Error fetching notifications:', response.statusText);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch('/api/user/notifications/[id]', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch('/api/user/notifications/[id]', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ markAllAsRead: true })
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch('/api/user/notifications/[id]', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filterNotifications = () => {
    switch (activeTab) {
      case 'sin-leer':
        return notifications.filter(n => !n.is_read);
      case 'menciones':
        return notifications.filter(n => n.type === 'mention');
      case 'grupos':
        return notifications.filter(n => n.type === 'group');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = filterNotifications();
  const config = TYPE_CONFIG['system'];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[420px] p-0 bg-background border-l border-warm/40">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 pb-4">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle className="text-3xl font-playfair font-black text-primary">Notificaciones</SheetTitle>
              <Button variant="ghost" size="icon" className="text-muted"><MoreHorizontal className="w-5 h-5" /></Button>
            </div>
            <div className="flex justify-between items-center">
              <Button 
                variant="link" 
                className="text-accent p-0 font-bold text-xs uppercase tracking-widest h-auto"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Marcar todo como leído
              </Button>
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-8 border-b border-warm/20">
              <TabsList className="bg-transparent p-0 gap-6 w-full justify-start h-12">
                {['todas', 'sin-leer', 'menciones', 'grupos'].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="bg-transparent p-0 h-full text-[10px] font-bold uppercase tracking-widest rounded-none data-[state=active]:bg-transparent data-[state=active]:text-amber border-b-2 border-transparent data-[state=active]:border-amber shadow-none"
                  >
                    {tab === 'sin-leer' ? 'Sin leer' : tab === 'todas' ? 'Todas' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'sin-leer' && unreadCount > 0 && <Badge className="ml-2 bg-rust text-[8px] h-4 w-4 p-0 flex items-center justify-center">{unreadCount}</Badge>}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {loading ? (
                  <div className="p-6 text-center text-muted">Cargando notificaciones...</div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted">No hay notificaciones</div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const typeConfig = TYPE_CONFIG[notif.type] || TYPE_CONFIG['system'];
                    const Icon = typeConfig.icon;
                    
                    return (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-6 flex gap-4 transition-colors border-b border-warm/10 group hover:bg-warm/10",
                          !notif.is_read ? "bg-amber-pale/30" : ""
                        )}
                      >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-warm/20 flex items-center justify-center">
                            <Icon className={cn("w-6 h-6", typeConfig.color)} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm leading-relaxed text-charcoal font-semibold">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted leading-relaxed">
                            {notif.content}
                          </p>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{getRelativeTime(notif.created_at)}</span>
                        </div>

                        <div className="flex gap-2 items-start">
                          {!notif.is_read && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 hover:bg-accent/20"
                              onClick={() => handleMarkAsRead(notif.id)}
                            >
                              <Check className="w-3 h-3 text-accent" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-rust/20"
                            onClick={() => handleDelete(notif.id)}
                          >
                            <X className="w-3 h-3 text-rust" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <div className="p-8 border-t border-warm/20">
              <Button className="w-full bg-primary hover:bg-accent text-cream rounded-2xl py-6 font-bold text-sm uppercase tracking-widest transition-all">
                Ver toda la actividad
              </Button>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

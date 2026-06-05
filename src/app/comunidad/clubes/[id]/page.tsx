'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GroupJoinButton from '@/components/groups/GroupJoinButton';
import GroupChat from '@/components/groups/GroupChat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, ArrowLeft, Loader } from 'lucide-react';

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

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = typeof params.id === 'string' ? parseInt(params.id) : parseInt(String(params.id));
  
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchGroupDetails();
    getCurrentUser();
  }, [groupId]);

  useEffect(() => {
    // Verificar membresía cuando tenemos ambos: grupo y usuario actual
    if (group && currentUserId) {
      checkMembership(group);
    }
  }, [group, currentUserId]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data.data);
        checkMembership(data.data);
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
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

  const checkMembership = (groupData: GroupData) => {
    if (!currentUserId) return;
    const isMemberCheck = groupData.members?.some((m: any) => m.user_id === currentUserId);
    setIsMember(isMemberCheck || false);
  };

  const handleJoinSuccess = () => {
    fetchGroupDetails();
    setIsMember(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
        <Navigation activeTab="comunidad" />
        <div className="max-w-4xl mx-auto pt-16 flex items-center justify-center">
          <Loader className="animate-spin text-accent w-8 h-8" />
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
        <Navigation activeTab="comunidad" />
        <div className="max-w-4xl mx-auto pt-16">
          <Card className="p-8 text-center bg-white/[0.02] border-white/5">
            <p className="text-white/60">Grupo no encontrado</p>
          </Card>
        </div>
      </main>
    );
  }

  const COLORES = ["#8B4513", "#4A6FA5", "#2D6A4F", "#5C4033", "#1A1A2E", "#6B3410", "#003D5B", "#1B4332"];
  const color = COLORES[group.id % COLORES.length];

  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
      <Navigation activeTab="comunidad" />

      <div className="max-w-4xl mx-auto pt-16">
        {/* Botón atrás */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-8 text-white/60 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Detalles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header del grupo */}
            <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-start gap-6">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white/20"
                  style={{ backgroundColor: color, opacity: 0.4 }}
                >
                  <BookOpen className="w-12 h-12" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-playfair font-black text-white">{group.name}</h1>
                    <Badge className="inline-block bg-white/10 text-white/80 border-white/10 text-[9px] font-black uppercase">
                      {group.topic}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm">Por: <span className="text-accent font-bold">{group.creator_alias}</span></p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{group.member_count} miembros</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{group.description}</p>
              </div>
            </Card>

            {/* Chat */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-black text-white">Conversación</h2>
              <GroupChat groupId={group.id} isMember={isMember} />
            </div>
          </div>

          {/* Columna derecha: Acciones */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-white/[0.02] border-white/5 p-6 rounded-[2.5rem] space-y-4">
                <h3 className="text-lg font-playfair font-black text-white">Información</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase font-bold">Miembros</p>
                    <p className="text-white font-bold text-lg">{group.member_count}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase font-bold">Creado</p>
                    <p className="text-white text-sm">
                      {new Date(group.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Botón unirse */}
              <Card className="bg-white/[0.02] border-white/5 p-6 rounded-[2.5rem]">
                <GroupJoinButton groupId={group.id} onSuccess={handleJoinSuccess} />
              </Card>

              {/* Miembros */}
              {isMember && (
                <Card className="bg-white/[0.02] border-white/5 p-6 rounded-[2.5rem] space-y-4">
                  <h3 className="text-sm font-playfair font-black text-white">Miembros del grupo</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {group.members?.map((member: any) => (
                      <div key={member.user_id} className="text-sm text-white/60 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        {member.alias} {member.role === 'admin' && <Badge className="text-[8px] bg-accent/20">Admin</Badge>}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

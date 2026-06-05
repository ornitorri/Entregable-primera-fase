'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  Plus, 
  Star, 
  Trophy,
  Target,
  ArrowRight,
  Loader
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CreateGroupForm from '@/components/groups/CreateGroupForm';
import { cn } from '@/lib/utils';

const RETOS_ACTIVOS = [
  { id: 1, nombre: "Reto 50 libros 2024", participantes: 234, meta: 50, tuProgreso: 4, deadline: "31 Dic 2024", completado: false },
  { id: 2, nombre: "Mes del realismo mágico", participantes: 89, meta: 3, tuProgreso: 2, deadline: "30 Abr 2024", completado: false },
  { id: 3, nombre: "Clásicos Latinoamericanos", participantes: 156, meta: 10, tuProgreso: 10, deadline: "31 Mar 2024", completado: true },
];

const COLORES = ["#8B4513", "#4A6FA5", "#2D6A4F", "#5C4033", "#1A1A2E", "#6B3410", "#003D5B", "#1B4332"];

interface Group {
  id: number;
  name: string;
  description: string;
  topic: string;
  member_count: number;
  creator_alias: string;
}

export default function ClubesLecturaPage() {
  const [grupos, setGrupos] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [userPlan, setUserPlan] = useState<string>('free');

  useEffect(() => {
    cargarGrupos();
    obtenerUsuario();
  }, []);

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setGrupos(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuario = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role || 'user');
        setUserPlan(data.subscription_plan || 'free');
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    }
  };

  const canCreateGroup = userRole === 'admin' || userPlan === 'embajador';

  const getColorForGroup = (groupId: number) => {
    return COLORES[groupId % COLORES.length];
  };

  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
      <Navigation activeTab="comunidad" />

      <div className="max-w-7xl mx-auto pt-16">
        {/* Hero Section */}
        <div className="space-y-4 mb-20 text-center md:text-left">
          <Badge className="bg-accent/10 text-accent border border-accent/20 px-4 py-1 font-black uppercase text-[10px] tracking-widest">
            Comunidad Exclusiva
          </Badge>
          <h1 className="text-6xl md:text-8xl font-playfair font-black text-white tracking-tighter leading-none">
            Clubes & <span className="text-accent italic">Retos.</span>
          </h1>
          <p className="text-xl text-white/40 italic font-light max-w-2xl">Comparte tu viaje literario con otros apasionados.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: CLUBES */}
          <div className="space-y-24">
            
            {/* Grupos Literarios */}
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-white/5 pb-6">
                <h3 className="text-3xl font-playfair font-black text-white">Grupos Literarios</h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{grupos.length} grupos</span>
                  {canCreateGroup && (
                    <Button 
                      onClick={() => setIsCreateFormOpen(true)}
                      className="bg-accent hover:bg-white hover:text-accent text-white rounded-xl px-4 h-10 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Crear
                    </Button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-accent w-8 h-8" />
                </div>
              ) : grupos.length === 0 ? (
                <Card className="p-8 text-center bg-white/[0.02] border-white/5">
                  <p className="text-white/40 text-sm">Aún no hay grupos creados</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grupos.map((grupo) => {
                    const color = getColorForGroup(grupo.id);
                    return (
                      <Link key={grupo.id} href={`/comunidad/clubes/${grupo.id}`}>
                        <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all group relative overflow-hidden cursor-pointer h-full">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: color }} />
                          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:text-accent transition-all duration-500 shadow-inner" style={{ backgroundColor: color, opacity: 0.4 }}>
                            <BookOpen className="w-8 h-8" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-playfair font-black text-white truncate">{grupo.name}</h4>
                            <Badge className="bg-white/10 text-white/80 border-white/10 text-[9px] font-black uppercase">{grupo.topic}</Badge>
                            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest flex items-center gap-2">
                              <Users className="w-3 h-3" /> {grupo.member_count} miembros
                            </p>
                            <p className="text-xs text-white/40 italic line-clamp-2 leading-relaxed pt-2">"{grupo.description || 'Sin descripción'}"</p>
                          </div>
                          <div className="text-[9px] text-white/30 italic">Por: {grupo.creator_alias}</div>
                          <Button variant="outline" className="w-full rounded-2xl border-white/10 text-white/60 hover:border-accent hover:text-accent font-black uppercase text-[9px] tracking-widest h-12 transition-all">
                            Ver grupo +
                          </Button>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Modal para crear grupo */}
            <CreateGroupForm
              isOpen={isCreateFormOpen}
              onClose={() => setIsCreateFormOpen(false)}
              onSuccess={() => {
                setIsCreateFormOpen(false);
                cargarGrupos();
              }}
            />
          </div>

          {/* COLUMNA DERECHA: RETOS */}
          <aside className="space-y-12">
            <div className="sticky top-24 space-y-12">
              <Card className="rounded-[3rem] p-10 bg-accent/5 border-accent/20 shadow-2xl relative overflow-hidden">
                <Target className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 rotate-12" />
                
                <h3 className="text-3xl font-playfair font-black text-white mb-8 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-accent" /> Retos Literarios
                </h3>

                <div className="space-y-10">
                  {RETOS_ACTIVOS.map((reto) => (
                    <div key={reto.id} className="space-y-4 group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h5 className="font-bold text-white text-base group-hover:text-accent transition-colors">{reto.nombre}</h5>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{reto.participantes} participantes</p>
                        </div>
                        {reto.completado && (
                          <div className="w-8 h-8 bg-sage/20 text-sage rounded-full flex items-center justify-center animate-bounce">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span className={reto.completado ? "text-sage" : "text-white/40"}>
                            {reto.tuProgreso} de {reto.meta} libros
                          </span>
                          <span className="text-white/20">Meta {reto.deadline}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full transition-all duration-1000",
                            reto.completado ? "bg-sage" : "bg-accent"
                          )} style={{ width: `${(reto.tuProgreso / reto.meta) * 100}%` }} />
                        </div>
                      </div>

                      {reto.completado && (
                        <Badge className="w-full bg-sage/10 text-sage border-sage/20 font-black text-[8px] justify-center py-2 uppercase tracking-[0.2em] rounded-xl">
                          ¡RETO COMPLETADO! 🎉
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-12 bg-white text-black hover:bg-accent hover:text-white rounded-[2rem] h-16 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all">
                  Crear nuevo reto
                </Button>
              </Card>

              {/* Tips de la semana */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Consejo del Embajador</h4>
                <p className="text-sm text-white/60 italic leading-relaxed font-light">
                  "Leer 15 minutos antes de dormir no solo mejora tu racha, sino que te ayuda a procesar mejor las historias. ¡No rompas tu streak!"
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tip de @JulianVance</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}

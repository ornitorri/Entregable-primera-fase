'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Activity, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare, 
  Heart, 
  Flame, 
  Award, 
  Settings, 
  Plus, 
  ChevronRight,
  LogOut,
  Edit2,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EstantePage from '@/app/estante/page';
import LogrosPage from '@/app/logros/page';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---

const ACTIVIDAD = [
  { id: 1, tipo:"libro_leido", fecha:"Hace 2 días", contenido:"Terminó de leer", libro:"El Aleph", autor:"Borges", resena:"Una obra maestra del cuento fantástico. Borges en su máximo esplendor.", estrellas:5 },
  { id: 2, tipo:"progreso", fecha:"Hace 3 días", contenido:"Actualizó progreso en", libro:"Cien Años de Soledad", progreso:65, pagina:271, totalPaginas:417 },
  { id: 3, tipo:"unio_club", fecha:"Hace 1 semana", contenido:"Se unió al club", club:"Clásicos Eternos" },
  { id: 4, tipo:"resena", fecha:"Hace 1 semana", contenido:"Reseñó", libro:"Rayuela", autor:"Cortázar", resena:"Cortázar rompe todas las reglas narrativas de una manera genial.", estrellas:4 },
  { id: 5, tipo:"insignia", fecha:"Hace 2 semanas", contenido:"Desbloqueó la insignia", insignia:"Lector Voraz", icono:"🔥" },
];

const MIS_GRUPOS = [
  { id:1, nombre:"Clásicos Eternos", miembros:24, rol:"Miembro", libroActual:"Pedro Páramo", portadaColor:"#8B4513", proximaReunion:"Sáb 30 Mar, 7pm", mensajesNuevos:3, descripcion:"El mejor club de literatura clásica de Colombia" },
  { id:2, nombre:"Fantasía Juvenil", miembros:31, rol:"Moderador", libroActual:"El Principito", portadaColor:"#4A6FA5", proximaReunion:"Dom 31 Mar, 5pm", mensajesNuevos:0, descripcion:"Para los que nunca dejamos de soñar" },
];

export default function PerfilPage() {
  const [activeSection, setActiveSection] = useState<'actividad' | 'estante' | 'logros' | 'grupos'>('actividad');
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [redeemProcessing, setRedeemProcessing] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [ownedRewards, setOwnedRewards] = useState<any[]>([]);
  const [loadingOwned, setLoadingOwned] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchRewards();
    fetchOwnedRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoadingRewards(true);
      const res = await fetch('/api/rewards');
      if (!res.ok) return;
      const data = await res.json();
      setRewards(data || []);
    } catch (err) {
      console.error('Error fetching rewards', err);
    } finally {
      setLoadingRewards(false);
    }
  };

  const fetchOwnedRewards = async () => {
    try {
      setLoadingOwned(true);
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || (() => {
        const m = document.cookie.match(/(^|;)\s*readzzi_token=([^;]+)/);
        return m ? decodeURIComponent(m[2]) : null;
      })();
      if (!token) return;
      const res = await fetch('/api/user/rewards', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setOwnedRewards(data || []);
    } catch (err) {
      console.error('Error fetching owned rewards', err);
    } finally {
      setLoadingOwned(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setStats(data.stats);
      } else {
        setError('Error al cargar el perfil');
      }
    } catch (err) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser((prev: any) => ({ ...prev, avatarUrl: data.avatarUrl }));
      } else {
        const data = await response.json();
        setUploadError(data.error || 'Error al subir la imagen');
      }
    } catch (err) {
      setUploadError('Error conectando al servidor');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent pt-[72px] pb-20">
        <Navigation activeTab="comunidad" />
        <div className="flex items-center justify-center h-96">
          <div className="text-white/60">Cargando perfil...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-transparent pt-[72px] pb-20">
        <Navigation activeTab="comunidad" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-transparent pt-[72px] pb-20">
        <Navigation activeTab="comunidad" />
        <div className="flex items-center justify-center h-96">
          <div className="text-white/60">Usuario no encontrado</div>
        </div>
      </main>
    );
  }

  const navItems = [
    { id: 'actividad', label: 'Actividad', icon: Activity },
    { id: 'estante', label: 'Estante', icon: BookOpen },
    { id: 'logros', label: 'Logros', icon: Trophy },
    { id: 'grupos', label: 'Clubes', icon: Users },
  ] as const;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20">
      <Navigation activeTab="comunidad" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-8 md:pt-12">
        {/* Profile Grid - Adaptive 1 to 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Profile Header & Sidebar Nav */}
          <aside className="lg:sticky lg:top-[92px] space-y-6">
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-6 xl:p-8 space-y-8 overflow-hidden relative shadow-2xl">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" className="text-white/20 hover:text-accent rounded-full h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile identity */}
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar with applied frame */}
                {(() => {
                  const appliedFrame = ownedRewards.find((r) => r.type === 'frame' && r.metadata?.applied);
                  const frameImageUrl = appliedFrame ? (
                    appliedFrame.image_url.startsWith('http') 
                      ? appliedFrame.image_url 
                      : (typeof window !== 'undefined' ? window.location.origin + appliedFrame.image_url : appliedFrame.image_url)
                  ) : null;
                  
                  return (
                    <div 
                      className="relative w-24 h-24 rounded-full p-1 shadow-2xl ring-4 ring-black group"
                      style={frameImageUrl ? {
                        backgroundImage: `url('${frameImageUrl}')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'transparent'
                      } : {
                        backgroundImage: 'linear-gradient(135deg, #f59e0b, #ff8c00)',
                      }}
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-background">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-7 h-7 bg-accent rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                        <Upload className="w-3 h-3 text-white" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  );
                })()}
                <div className="space-y-1">
                  <h2 className="text-2xl font-playfair font-black text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-0.5">
                    Usuario Registrado ⭐
                  </Badge>
                </div>
                <p className="text-xs text-white/40 italic font-light leading-relaxed max-w-[200px]">
                  "{user?.bio || 'Sin biografía aún'}"
                </p>
                {user?.location && (
                  <div className="space-y-2 w-full pt-2">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-accent" /> {user.location}
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full rounded-xl border-white/10 text-white/60 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest h-10 mt-2">
                  <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar Perfil
                </Button>
                {uploadError && (
                  <p className="text-xs text-red-400 text-center">{uploadError}</p>
                )}
              </div>

              {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                {[
                  { val: stats?.books || '0', label: 'Libros' },
                  { val: stats?.reviews || '0', label: 'Reseñas' },
                  { val: stats?.communities || '0', label: 'Clubes' }
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <span className="block text-lg font-black text-white tracking-tighter">{s.val}</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-center">
                  <span className="block text-2xl font-black text-white">{user?.points || 0}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Puntos acumulados</span>
                </div>
              </div>

              {/* Navigation Tabs - Hidden on mobile (uses tabs below header) */}
              <nav className="hidden lg:flex flex-col gap-1 pt-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden",
                      activeSection === item.id 
                        ? "bg-accent text-white shadow-xl shadow-accent/20" 
                        : "text-white/40 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight className={cn("w-3 h-3 transition-transform", activeSection === item.id ? "opacity-100" : "opacity-0")} />
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* COLUMNA CENTRAL: Content with internal mobile tabs */}
          <section className="space-y-8 animate-in fade-in duration-500">
            {/* Mobile/Tablet Tab Navigation */}
            <div className="lg:hidden sticky top-[72px] z-40 bg-[#0a0a0c]/90 backdrop-blur-xl -mx-4 px-4 py-3 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeSection === item.id 
                        ? "bg-accent text-white shadow-lg" 
                        : "bg-white/5 text-white/40"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content Sections */}
            {activeSection === 'actividad' && (
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-white/5 pb-6">
                  <h3 className="text-3xl font-playfair font-black text-white">Actividad Reciente</h3>
                  <Badge variant="outline" className="border-white/10 text-white/20 text-[9px] font-black uppercase tracking-widest">30 DÍAS</Badge>
                </div>
                
                <div className="space-y-4">
                  {ACTIVIDAD.map((item) => (
                    <Card key={item.id} className="bg-white/[0.03] border-white/5 rounded-[2rem] p-6 md:p-8 hover:bg-white/[0.05] transition-all shadow-sm">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                          item.tipo === 'libro_leido' ? "bg-accent/20 text-accent" :
                          item.tipo === 'progreso' ? "bg-blue-500/20 text-blue-400" :
                          item.tipo === 'unio_club' ? "bg-sage/20 text-sage" :
                          "bg-purple-500/20 text-purple-400"
                        )}>
                          {item.id === 5 ? <Award className="w-6 h-6" /> : (item.tipo === 'libro_leido' ? <BookOpen className="w-6 h-6" /> : <Activity className="w-6 h-6" />)}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <p className="text-sm md:text-base text-white/80">
                              <span className="font-bold text-white">{user?.firstName}</span> {item.contenido} <span className="font-bold text-accent">{item.libro || item.club || item.insignia}</span>
                            </p>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{item.fecha}</p>
                          </div>

                          {item.resena && (
                            <div className="bg-black/20 border-l-2 border-accent p-4 md:p-6 rounded-r-2xl italic text-white/60 text-sm md:text-base leading-relaxed">
                              "{item.resena}"
                              <div className="flex gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn("w-3.5 h-3.5", i < item.estrellas ? "fill-accent text-accent" : "text-white/10")} />
                                ))}
                              </div>
                            </div>
                          )}

                          {item.progreso && (
                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                                <span>Página {item.pagina} de {item.totalPaginas}</span>
                                <span className="text-accent">{item.progreso}%</span>
                              </div>
                              <Progress value={item.progreso} className="h-1.5 bg-white/5" />
                            </div>
                          )}

                          <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                            <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-accent transition-colors">
                              <Heart className="w-4 h-4" /> Me gusta
                            </button>
                            <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white transition-colors">
                              <MessageSquare className="w-4 h-4" /> Comentar
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'estante' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EstantePage />
              </div>
            )}

            {activeSection === 'logros' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <LogrosPage />
              </div>
            )}

            {activeSection === 'grupos' && (
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-white/5 pb-6">
                  <h3 className="text-3xl font-playfair font-black text-white">Clubes Activos</h3>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{MIS_GRUPOS.length} suscritos</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {MIS_GRUPOS.map((grupo) => (
                    <Card key={grupo.id} className="relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.05] transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: grupo.portadaColor }} />
                      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4 w-full text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-center md:justify-start gap-3">
                                <h4 className="text-xl md:text-2xl font-playfair font-bold text-white">{grupo.nombre}</h4>
                                <Badge className="bg-white/5 text-white/40 border-white/10 text-[8px] font-black uppercase tracking-widest">{grupo.rol}</Badge>
                              </div>
                              <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                                <Users className="w-3.5 h-3.5" /> {grupo.miembros} lectores
                              </p>
                            </div>
                            {grupo.mensajesNuevos > 0 && (
                              <Badge className="bg-rust text-white border-none text-[9px] font-black px-3 py-1 animate-pulse">
                                {grupo.mensajesNuevos} NUEVOS
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-white/40 italic">"{grupo.descripcion}"</p>
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Actualmente leyendo</p>
                              <p className="text-sm font-bold text-accent italic">"{grupo.libroActual}"</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                              <Button className="flex-1 sm:flex-none bg-accent hover:bg-white hover:text-accent text-white rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Entrar
                              </Button>
                              <Button variant="ghost" className="text-rust hover:bg-rust/10 text-[9px] font-black uppercase tracking-widest px-4 h-11 rounded-xl">
                                Salir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* COLUMNA DERECHA: Widgets - LG Only */}
          <aside className="hidden lg:flex flex-col gap-8 sticky top-[92px]">
            {/* Racha Widget */}
            <Card className="bg-accent/5 border-accent/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5">
                <Flame className="w-32 h-32 text-accent" />
              </div>
              <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                <div className="relative">
                  <Flame className="w-16 h-16 text-accent fill-accent animate-pulse" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white pt-1">12</span>
                </div>
                <h4 className="text-lg font-playfair font-black text-white">Días Seguidos</h4>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Racha de lectura</p>
              </div>
              <div className="flex justify-between items-center px-2 relative z-10">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black transition-all",
                      i < 5 || i === 6 ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-white/5 text-white/10"
                    )}>
                      {i < 5 || i === 6 ? <Flame className="w-3 h-3 fill-current" /> : ''}
                    </div>
                    <span className={cn("text-[8px] font-bold", i < 5 || i === 6 ? "text-white" : "text-white/20")}>{d}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reading Challenge Widget */}
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-3">
                <Trophy className="w-4 h-4 text-accent" /> Reto 2024
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white tracking-tighter">4 <span className="text-sm text-white/30 font-bold uppercase tracking-widest">/ 50</span></span>
                    <span className="text-[10px] font-bold text-accent">8%</span>
                  </div>
                  <Progress value={8} className="h-1.5 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-4 rounded-2xl text-center">
                    <span className="block text-lg font-black text-white">271</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Páginas</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl text-center">
                    <span className="block text-lg font-black text-white">3</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Reseñas</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Badges Quick View */}
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Insignias</h4>
                <button onClick={() => setActiveSection('logros')} className="text-accent text-[9px] font-black uppercase hover:underline">Ver todas</button>
              </div>
              <div className="flex justify-between gap-3">
                {['📖', '🔥', '🌎'].map((emoji, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shadow-inner hover:scale-110 transition-all cursor-pointer">
                    {emoji}
                  </div>
                ))}
              </div>
            </Card>

            {/* Puntos Widget */}
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-6">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Puntos</h4>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-black text-white">{user?.points || 0}</div>
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Disponibles</div>
                </div>
                <div>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-accent text-white px-3 py-2 rounded-xl text-sm font-bold">Cómo canjear</button>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="number"
                  min={1}
                  value={redeemAmount || ''}
                  onChange={(e) => setRedeemAmount(Number(e.target.value))}
                  placeholder="Cantidad de puntos a canjear"
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-white"
                />
                <div className="flex gap-2">
                  <button
                    disabled={redeemProcessing}
                    onClick={async () => {
                      try {
                        setRedeemProcessing(true);
                        const token = localStorage.getItem('token');
                        const res = await fetch('/api/user/points', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ points: redeemAmount, reason: 'canje_perfil' })
                        });
                        const data = await res.json();
                        if (!res.ok) return alert(data.error || 'Error al canjear puntos');
                        alert('Canje exitoso. Puntos disponibles: ' + data.points);
                        // refrescar perfil
                        window.location.reload();
                      } catch (err) {
                        console.error(err);
                        alert('Error de red');
                      } finally { setRedeemProcessing(false); }
                    }}
                    className="flex-1 bg-accent text-white rounded-xl py-3 font-bold disabled:opacity-50"
                  >
                    {redeemProcessing ? 'Procesando...' : 'Canjear'}
                  </button>
                  <button onClick={() => setRedeemAmount(0)} className="flex-1 bg-white/5 text-white/60 rounded-xl py-3 font-bold">Limpiar</button>
                </div>
                <p className="text-[10px] text-white/30">Los puntos se descuentan inmediatamente y quedan registrados en tu historial.</p>
              </div>
            </Card>

            {/* Tienda de recompensas */}
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Tienda de Recompensas</h4>
                <button onClick={fetchRewards} className="text-accent text-[9px] font-black">Actualizar</button>
              </div>
              {loadingRewards ? (
                <div className="text-white/60 text-sm">Cargando recompensas...</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {rewards.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-black/10 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        {r.image_url ? (
                          <img
                            src={(r.image_url.startsWith('http') ? r.image_url : (typeof window !== 'undefined' ? window.location.origin + r.image_url : r.image_url))}
                            alt={r.name}
                            className="w-12 h-12 rounded-md object-cover"
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center">{r.name?.charAt(0)}</div>
                        )}
                        <div>
                          <div className="font-bold text-white">{r.name}</div>
                          <div className="text-[11px] text-white/40">{r.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-black">{r.points_cost} pts</div>
                        <button onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch('/api/rewards/redeem', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ rewardId: r.id })
                            });
                            const data = await res.json();
                            if (!res.ok) return alert(data.error || 'Error al canjear');
                            alert('Recompensa canjeada: ' + data.reward.name);
                            // refresh profile and rewards
                            fetchUserProfile();
                            fetchRewards();
                            fetchOwnedRewards();
                          } catch (err) {
                            console.error(err);
                            alert('Error de red');
                          }
                        }} className="bg-accent text-white px-3 py-1 rounded-xl text-sm font-bold">Canjear</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Mis recompensas (stickers, marcos) */}
            <Card className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Mis Recompensas</h4>
                <button onClick={fetchOwnedRewards} className="text-accent text-[9px] font-black">Actualizar</button>
              </div>
              {loadingOwned ? (
                <div className="text-white/60 text-sm">Cargando...</div>
              ) : ownedRewards.length === 0 ? (
                <div className="text-white/50 text-sm">No has canjeado recompensas aún.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {ownedRewards.map((or) => (
                    <div key={or.user_reward_id} className="flex items-center justify-between bg-black/10 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        {or.image_url ? (
                          <img
                            src={(or.image_url.startsWith('http') ? or.image_url : (typeof window !== 'undefined' ? window.location.origin + or.image_url : or.image_url))}
                            alt={or.name}
                            className="w-12 h-12 rounded-md object-cover"
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center">{or.name?.charAt(0)}</div>
                        )}
                        <div>
                          <div className="font-bold text-white">{or.name}</div>
                          <div className="text-[11px] text-white/40">{or.type} • Canjeado: {new Date(or.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-[10px] text-white/30 italic">ID {or.user_reward_id}</div>
                        {/* Apply frame button for frames */}
                        {or.type === 'frame' && (
                          <button onClick={async () => {
                            try {
                              const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || (() => {
                                const m = document.cookie.match(/(^|;)\s*readzzi_token=([^;]+)/);
                                return m ? decodeURIComponent(m[2]) : null;
                              })();
                              if (!token) return alert('No autenticado');
                              const res = await fetch('/api/user/rewards/apply', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ user_reward_id: or.user_reward_id })
                              });
                              const data = await res.json();
                              if (!res.ok) return alert(data.error || 'Error al aplicar');
                              alert('Marco aplicado: ' + or.name);
                              // actualizar estado local para reflejar aplicado
                              setOwnedRewards((prev) => prev.map((x) => ({ ...x, metadata: { ...(x.metadata || {}), applied: x.user_reward_id === or.user_reward_id } })));
                            } catch (err) {
                              console.error(err);
                              alert('Error de red');
                            }
                          }} className="bg-accent text-white px-3 py-1 rounded-xl text-sm font-bold">Aplicar</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </aside>

        </div>
      </div>
      <Footer />
    </main>
  );
}
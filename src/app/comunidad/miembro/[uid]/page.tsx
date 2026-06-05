'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BookOpen, 
  Star, 
  MessageSquare, 
  Users, 
  Calendar, 
  Trophy, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Mail, 
  Twitter, 
  Instagram, 
  Globe,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

// --- Mock Data ---

const MEMBER_DATA = {
  name: "Elena Martínez",
  username: "@elenalectora",
  role: "PREMIUM ⭐",
  bio: "Amante del realismo mágico y el café frío. Busco siempre historias que me hagan dudar de la realidad. Macondo es mi hogar espiritual.",
  avatar: "https://picsum.photos/seed/u2/200/200",
  banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
  location: "Bogotá, Colombia",
  joinedDate: "Marzo 2023",
  stats: {
    booksRead: 89,
    avgRating: 4.7,
    posts: 234,
    groups: 3,
  },
  social: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    web: "https://readzzi.com"
  },
  genres: [
    { name: "Realismo Mágico", value: 95 },
    { name: "Clásicos", value: 80 },
    { name: "Fantasía", value: 65 },
    { name: "Poesía", value: 40 }
  ],
  badges: [
    { id: 1, name: "🥇 Primer reseñador", desc: "Uno de los primeros 100 usuarios en escribir una reseña.", icon: Award },
    { id: 2, name: "📚 100 libros", desc: "Meta de lectura de 100 libros alcanzada.", icon: BookOpen },
    { id: 3, name: "👑 Embajador", desc: "Líder de comunidad verificado.", icon: Trophy },
    { id: 4, name: "⭐ Reseñador destacado", desc: "Sus reseñas han recibido más de 500 likes.", icon: Star },
    { id: 5, name: "🎯 Madrugador", desc: "Publicó su primera reseña antes de las 6 AM.", icon: Clock }
  ]
};

const ACTIVITY_DATA = [
  { id: 1, type: 'post', text: 'Finalmente terminé "Cien Años de Soledad". No tengo palabras, solo silencio y admiración.', date: 'hace 2 horas', likes: 24, comments: 12 },
  { id: 2, type: 'review', book: 'Pedro Páramo', rating: 5, text: 'Una obra que se siente como un susurro constante. Juan Rulfo es un genio del ambiente.', date: 'hace 1 día', likes: 45 },
  { id: 3, type: 'join', group: 'Clásicos Eternos', date: 'hace 3 días' }
];

const REVIEWS_DATA = [
  { id: 1, book: 'Rayuela', author: 'Julio Cortázar', rating: 5, date: '15 Oct 2023', text: 'Cortázar juega con el lector como si fuera un tablero. Es una experiencia física leer este libro.', cover: 'https://picsum.photos/seed/catalog3/200/300' },
  { id: 2, book: 'El Aleph', author: 'Jorge Luis Borges', rating: 4, date: '02 Sep 2023', text: 'La brevedad de Borges contiene el universo entero. Algunos cuentos requieren relectura inmediata.', cover: 'https://picsum.photos/seed/catalog2/200/300' }
];

const BOOKS_READ = [
  { id: 1, title: 'Cien Años de Soledad', cover: 'https://picsum.photos/seed/catalog1/200/300' },
  { id: 2, title: 'El Aleph', cover: 'https://picsum.photos/seed/catalog2/200/300' },
  { id: 3, title: 'Rayuela', cover: 'https://picsum.photos/seed/catalog3/200/300' },
  { id: 4, title: 'Don Quijote', cover: 'https://picsum.photos/seed/catalog5/200/300' },
  { id: 5, title: '1984', cover: 'https://picsum.photos/seed/catalog4/200/300' },
  { id: 6, title: 'Fahrenheit 451', cover: 'https://picsum.photos/seed/catalog9/200/300' }
];

export default function MiembroPerfilPage() {
  const [activeTab, setActiveTab] = useState('actividad');

  return (
    <main className="min-h-screen bg-background pt-nav pb-20">
      <Navigation activeTab="comunidad" onTabChange={() => {}} />

      {/* HERO DEL MIEMBRO */}
      <section className="relative w-full">
        {/* Banner */}
        <div className="h-[240px] w-full bg-parchment overflow-hidden relative border-b border-warm/40">
          <Image src={MEMBER_DATA.banner} alt="Banner" fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Info Principal */}
        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className={cn(
                "relative w-32 h-32 rounded-full p-1 bg-background shadow-2xl",
                MEMBER_DATA.role.includes("PREMIUM") ? "border-[3px] border-double border-amber" : 
                MEMBER_DATA.role.includes("EMBAJADOR") ? "border-[3px] border-amber shadow-[0_0_20px_rgba(200,134,10,0.3)]" : 
                "border-[3px] border-warm"
              )}>
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={MEMBER_DATA.avatar} alt={MEMBER_DATA.name} fill className="object-cover" />
                </div>
              </div>
              
              <div className="space-y-2 pb-2">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-playfair font-black text-primary tracking-tighter">
                    {MEMBER_DATA.name}
                  </h1>
                  <Badge className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                    MEMBER_DATA.role.includes("PREMIUM") ? "bg-amber-pale text-amber border-amber/20" : 
                    MEMBER_DATA.role.includes("EMBAJADOR") ? "bg-primary text-amber border-none" : 
                    "bg-warm text-muted"
                  )}>
                    {MEMBER_DATA.role}
                  </Badge>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm font-medium">
                  <span className="text-muted">{MEMBER_DATA.username}</span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="w-4 h-4" /> {MEMBER_DATA.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <Calendar className="w-4 h-4" /> {MEMBER_DATA.joinedDate}
                  </span>
                </div>
                <p className="max-w-xl font-dmsans text-lg text-charcoal italic font-light leading-relaxed">
                  "{MEMBER_DATA.bio}"
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-center lg:justify-end">
              <Button className="bg-primary hover:bg-accent text-cream rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/10 transition-all active:scale-95">
                Seguir
              </Button>
              <Button variant="outline" className="border-amber/30 text-amber hover:bg-amber-pale rounded-full px-8 h-12 font-bold transition-all">
                <Mail className="w-4 h-4 mr-2" />
                Mencionar
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 text-muted">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-12 mt-12 py-8 border-y border-warm/40 font-dmsans">
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-primary">📚 {MEMBER_DATA.stats.booksRead}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Libros leídos</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-amber">⭐ {MEMBER_DATA.stats.avgRating}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Promedio reseñas</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-primary">💬 {MEMBER_DATA.stats.posts}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Publicaciones</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-primary">👥 {MEMBER_DATA.stats.groups}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Grupos</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA (CONTENIDO TABS) */}
          <div className="lg:col-span-8 space-y-12">
            <Tabs defaultValue="actividad" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent p-0 gap-8 h-12 w-full justify-start border-b border-warm/40 rounded-none mb-10 overflow-x-auto no-scrollbar">
                {[
                  { id: 'actividad', label: 'Actividad', icon: TrendingUp },
                  { id: 'reseñas', label: 'Reseñas', icon: Star },
                  { id: 'libros', label: 'Libros leídos', icon: BookOpen },
                  { id: 'comun', label: 'Grupos en común', icon: Users },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="bg-transparent p-0 h-full text-xs font-bold uppercase tracking-widest rounded-none data-[state=active]:bg-transparent data-[state=active]:text-amber border-b-2 border-transparent data-[state=active]:border-amber shadow-none transition-all flex items-center gap-2"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* TAB ACTIVIDAD */}
              <TabsContent value="actividad" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  {ACTIVITY_DATA.map((item) => (
                    <div key={item.id} className="bg-card border border-warm/40 rounded-[2rem] p-8 shadow-sm group hover:shadow-md transition-all">
                      <div className="flex items-start gap-6">
                        <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center shrink-0">
                          {item.type === 'post' ? <MessageSquare className="w-5 h-5 text-amber" /> : 
                           item.type === 'review' ? <Star className="w-5 h-5 text-amber" /> : 
                           <Users className="w-5 h-5 text-sage" />}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-primary">
                              {item.type === 'post' ? 'Publicó una actualización' : 
                               item.type === 'review' ? `Reseñó ${item.book}` : 
                               `Se unió al grupo ${item.group}`}
                            </h4>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{item.date}</span>
                          </div>
                          {item.text && <p className="text-muted-foreground italic leading-relaxed">"{item.text}"</p>}
                          {item.type !== 'join' && (
                            <div className="flex items-center gap-4 pt-2">
                              <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-amber transition-colors">
                                <Heart className="w-4 h-4" /> {item.likes}
                              </button>
                              {item.comments && (
                                <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-amber transition-colors">
                                  <MessageSquare className="w-4 h-4" /> {item.comments}
                                </button>
                              )}
                              <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-amber transition-colors">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-muted hover:text-amber font-bold py-6 rounded-2xl border-2 border-dashed border-warm/40 hover:border-amber/20">
                  Cargar más actividad
                </Button>
              </TabsContent>

              {/* TAB RESEÑAS */}
              <TabsContent value="reseñas" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Resumen Rating */}
                <div className="bg-parchment/30 rounded-[2.5rem] p-10 border border-warm/40 flex flex-col md:flex-row items-center gap-12">
                  <div className="text-center space-y-2">
                    <span className="text-7xl font-playfair font-black text-amber">{MEMBER_DATA.stats.avgRating}</span>
                    <div className="flex items-center text-amber">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="text-xs font-bold text-muted uppercase tracking-widest">89 reseñas totales</span>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-4 group">
                        <span className="text-xs font-bold text-muted w-4">{star}</span>
                        <Progress value={star === 5 ? 85 : star === 4 ? 12 : 3} className="h-2 bg-warm" />
                        <span className="text-xs font-bold text-muted w-8">{star === 5 ? '85%' : star === 4 ? '12%' : '3%'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {REVIEWS_DATA.map(rev => (
                    <Card key={rev.id} className="bg-card border-none rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all duration-500">
                      <div className="relative aspect-[2/3] w-32 md:w-40 rounded-2xl overflow-hidden shadow-lg shrink-0 group-hover:-rotate-2 transition-transform">
                        <Image src={rev.cover} alt={rev.book} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-playfair font-bold text-primary group-hover:text-amber transition-colors">{rev.book}</h3>
                            <p className="text-sm font-medium text-muted italic">{rev.author}</p>
                          </div>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber">
                          {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-4 h-4", s <= rev.rating ? "fill-current" : "")} />)}
                        </div>
                        <p className="text-charcoal font-dmsans italic leading-relaxed line-clamp-3">"{rev.text}"</p>
                        <Button variant="ghost" className="p-0 h-auto text-accent font-bold uppercase tracking-widest text-[10px] hover:bg-transparent hover:underline">
                          Leer reseña completa <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* TAB LIBROS LEÍDOS */}
              <TabsContent value="libros" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-playfair font-bold text-primary">Biblioteca Personal <span className="text-muted text-lg font-dmsans font-normal ml-2">({MEMBER_DATA.stats.booksRead})</span></h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold uppercase tracking-widest border-warm">Género ▾</Button>
                    <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold uppercase tracking-widest border-warm">Año ▾</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {BOOKS_READ.map((book) => (
                    <TooltipProvider key={book.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer space-y-2">
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                              <Image src={book.cover} alt={book.title} fill className="object-cover" />
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-ink text-cream border-none p-3 rounded-xl shadow-2xl">
                          <p className="font-bold text-xs">{book.title}</p>
                          <div className="flex items-center text-amber mt-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-current" />)}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </TabsContent>

              {/* TAB GRUPOS EN COMÚN */}
              <TabsContent value="comun" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-parchment/30 border-2 border-dashed border-warm/60 rounded-[3rem] p-20 text-center space-y-4">
                  <div className="flex justify-center -space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-4 border-background overflow-hidden">
                      <Image src={MEMBER_DATA.avatar} alt="Member" width={64} height={64} className="object-cover" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-background bg-amber flex items-center justify-center text-cream font-bold text-xl">
                      Tú
                    </div>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-primary">¡Tienen 2 grupos en común!</h3>
                  <p className="text-muted-foreground italic font-light max-w-sm mx-auto">
                    Comparten intereses en "Clásicos Eternos" y "Realismo Mágico".
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    {['Clásicos Eternos', 'Realismo Mágico'].map((g, i) => (
                      <div key={i} className="bg-card p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all border border-warm/20">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center text-amber font-bold">
                            {g[0]}
                          </div>
                          <span className="font-bold text-primary group-hover:text-amber transition-colors">{g}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* COLUMNA DERECHA (SIDEBAR) */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-24 space-y-12">
              
              {/* Insignias Ganadas */}
              <Card className="rounded-[2.5rem] p-8 shadow-sm border-warm/40 bg-card/50 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber/5 rounded-full blur-3xl" />
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-8 flex items-center gap-2 relative z-10">
                  <Award className="w-4 h-4 text-amber" /> Insignias ganadas
                </h4>
                <div className="flex flex-wrap gap-4 relative z-10">
                  <TooltipProvider>
                    {MEMBER_DATA.badges.map((badge) => (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          <div className="w-14 h-14 rounded-2xl bg-parchment/50 hover:bg-amber-pale flex items-center justify-center cursor-help transition-all border border-warm/40 hover:border-amber/30 group">
                            <badge.icon className="w-7 h-7 text-muted group-hover:text-amber transition-colors" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-ink text-cream border-none p-4 rounded-xl shadow-2xl max-w-[200px] text-center">
                          <p className="font-bold text-amber text-xs mb-1 uppercase tracking-widest">{badge.name}</p>
                          <p className="text-[10px] font-medium leading-relaxed italic">{badge.desc}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </Card>

              {/* Géneros Favoritos */}
              <Card className="rounded-[2.5rem] p-10 shadow-sm border-warm/40">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-8">Géneros favoritos</h4>
                <div className="space-y-6">
                  {MEMBER_DATA.genres.map((genre, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                        <span className="text-primary">{genre.name}</span>
                        <span className="text-amber">{genre.value}%</span>
                      </div>
                      <Progress value={genre.value} className="h-2 bg-warm" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Grupos que administra */}
              {MEMBER_DATA.role.includes("EMBAJADOR") && (
                <Card className="bg-primary text-cream rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                  <Crown className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
                  <h4 className="text-[10px] font-bold text-amber uppercase tracking-[0.2em] mb-8 relative z-10">Comunidades que lidera</h4>
                  <div className="space-y-4 relative z-10">
                    {[
                      { n: 'Círculo de Realismo Mágico', m: '1.2k' },
                      { n: 'Poetas de Bogotá', m: '450' }
                    ].map((g, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-[10px] font-black">{g.n[0]}</div>
                          <span className="text-sm font-bold group-hover:text-amber transition-colors line-clamp-1">{g.n}</span>
                        </div>
                        <span className="text-[10px] font-bold opacity-60">{g.m}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-6 text-amber hover:bg-white/10 font-bold text-xs uppercase tracking-widest gap-2">
                    <Plus className="w-4 h-4" /> Crear nuevo grupo
                  </Button>
                </Card>
              )}

              {/* Social Media */}
              <div className="flex justify-center gap-6 opacity-60">
                <Link href={MEMBER_DATA.social.twitter} className="hover:text-amber transition-colors"><Twitter className="w-6 h-6" /></Link>
                <Link href={MEMBER_DATA.social.instagram} className="hover:text-amber transition-colors"><Instagram className="w-6 h-6" /></Link>
                <Link href={MEMBER_DATA.social.web} className="hover:text-amber transition-colors"><Globe className="w-6 h-6" /></Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

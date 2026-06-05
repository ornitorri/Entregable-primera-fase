'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Grid2X2, 
  List, 
  ChevronRight,
  Bell,
  Star,
  Map as MapIcon,
  Mic2,
  BookOpen,
  History,
  Inbox
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-4 5-4" />
      <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 4-5 4-5" />
    </svg>
  );
}

const CATEGORIES = [
  { id: 'todas', label: 'Todas', icon: BookOpen },
  { id: 'noticias', label: 'Noticias', icon: Bell },
  { id: 'giras', label: 'Giras', icon: MapIcon },
  { id: 'ferias', label: 'Ferias', icon: Star },
  { id: 'lanzamientos', label: 'Lanzamientos', icon: RocketIcon },
  { id: 'entrevistas', label: 'Entrevistas', icon: Mic2 },
];

const NEWS_MOCK = [
  {
    id: 1,
    type: 'giras',
    typeLabel: 'Gira',
    title: 'Gabo por Colombia: Una ruta por los escenarios de Macondo',
    excerpt: 'Explora los lugares que inspiraron la obra del Nobel en un recorrido literario sin precedentes por el Caribe colombiano.',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2000&auto=format&fit=crop',
    date: '15 Abr 2024',
    location: 'Aracataca, Magdalena',
    featured: true
  },
  {
    id: 2,
    type: 'ferias',
    typeLabel: 'Feria',
    title: 'FILBO 2024: Brasil es el país invitado de honor este año',
    excerpt: 'La Feria Internacional del Libro de Bogotá regresa con una programación cargada de autores brasileños y debates.',
    image: 'https://images.unsplash.com/photo-1526243128144-62553984ee1a?q=80&w=2000&auto=format&fit=crop',
    date: '18 Abr 2024',
    location: 'Corferias, Bogotá',
  },
];

export default function NoticiasPage() {
  const [activeTab, setActiveTab] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newsList, setNewsList] = useState<any[]>(NEWS_MOCK);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news?limit=100');
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((item: any, index: number) => ({
          id: item.id,
          type: item.category || 'noticias',
          typeLabel:
            item.category === 'giras'
              ? 'Gira'
              : item.category === 'ferias'
                ? 'Feria'
                : item.category === 'lanzamientos'
                  ? 'Lanzamiento'
                  : item.category === 'entrevistas'
                    ? 'Entrevista'
                    : 'Noticia',
          title: item.title,
          excerpt: item.summary || item.content?.slice(0, 180) || '',
          image: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2000&auto=format&fit=crop',
          date: new Date(item.published_at).toLocaleDateString('es-CO'),
          location: item.location || 'Colombia',
          featured: index === 0
        }));
        setNewsList(mapped);
      } catch (error) {
        // fallback silencioso a mock local
      }
    };
    loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    return newsList.filter(news => {
      const matchesTab = activeTab === 'todas' || news.type === activeTab;
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [newsList, activeTab, searchTerm]);

  const featuredNews = filteredNews.find(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20">
      <Navigation activeTab="noticias" />

      {/* FILTROS STICKY */}
      <div className="bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/10 py-4 sticky top-[72px] z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === cat.id
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent" />
              <Input 
                placeholder="Buscar nota..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white/5 border-white/10 rounded-full text-xs text-white placeholder:text-white/20"
              />
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewMode('grid')}
                className={cn("h-9 w-9 rounded-lg", viewMode === 'grid' ? "text-accent bg-accent/10" : "text-white/30")}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewMode('list')}
                className={cn("h-9 w-9 rounded-lg", viewMode === 'list' ? "text-accent bg-accent/10" : "text-white/30")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="space-y-12">
          
          {/* HERO CARD */}
          {activeTab === 'todas' && featuredNews && (
            <Card className="group relative min-h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] border-none shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Image 
                src={featuredNews.image} 
                alt={featuredNews.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <Badge className="bg-accent text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[8px]">
                  {featuredNews.typeLabel} Destacado
                </Badge>
                <h2 className="text-3xl md:text-6xl font-playfair font-black text-white leading-tight tracking-tight max-w-4xl">
                  {featuredNews.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-white/70 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent" /> {featuredNews.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {featuredNews.location}</span>
                </div>
                <Link href={`/noticias/${featuredNews.id}`}>
                  <Button className="bg-white text-primary hover:bg-accent hover:text-white rounded-full px-8 h-12 font-bold text-sm shadow-xl transition-all">
                    Leer nota completa <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* GRID CORREGIDO: Sin espacios vacíos enormes */}
          <div className={cn(
            "grid gap-8 md:gap-10",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {regularNews.length > 0 ? regularNews.map((news) => (
              <Card key={news.id} className={cn(
                "group bg-white/[0.03] border-white/10 rounded-[2rem] overflow-hidden shadow-sm hover:bg-white/[0.05] transition-all duration-500",
                viewMode === 'list' && "flex flex-col md:flex-row h-auto"
              )}>
                <div className={cn(
                  "relative overflow-hidden shrink-0",
                  viewMode === 'grid' ? "aspect-video" : "aspect-video md:w-72"
                )}>
                  <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <Badge className="px-2 py-0.5 bg-accent text-white border-none font-black uppercase tracking-widest text-[7px]">
                      {news.typeLabel}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-white leading-tight group-hover:text-accent transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/50 leading-relaxed line-clamp-3 italic font-light">
                      "{news.excerpt}"
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-3 text-[8px] font-black text-white/30 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {news.date}
                    </div>
                    <Link href={`/noticias/${news.id}`}>
                      <Button variant="link" className="text-accent p-0 h-auto font-black uppercase text-[8px] tracking-[0.2em] hover:text-white">
                        Leer más →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )) : !featuredNews && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                  <Inbox className="w-10 h-10 text-white/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-playfair font-bold text-white/60">No hay artículos disponibles aún</h3>
                  <p className="text-sm text-white/20 italic max-w-xs mx-auto">Vuelve pronto para descubrir nuevas historias del universo literario.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

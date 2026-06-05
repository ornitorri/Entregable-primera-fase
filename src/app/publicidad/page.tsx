'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Package,
  DollarSign,
  User,
  LayoutGrid,
  Activity,
  Plus,
  UserCog,
  Truck,
  Mail,
  Newspaper,
  ArrowRight,
  Megaphone,
  ShoppingBag,
  Search,
  Bell,
  Calendar,
  Zap,
  BookOpen,
  Upload,
  Info,
  Building2,
  FileText,
  Eye,
  Layers,
  ChevronRight,
  Star,
  Map,
  Mic2,
  Rocket,
  Download,
  MousePointer2,
  FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: string;
  title: string;
  type: 'Noticias' | 'Giras' | 'Ferias' | 'Lanzamientos' | 'Entrevistas';
  excerpt: string;
  date: string;
  location: string;
  image: string;
}

const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Gabo por Colombia: Una ruta por los escenarios de Macondo',
    type: 'Giras',
    excerpt: 'Explora los lugares que inspiraron la obra del Nobel...',
    date: '15 Abr 2024',
    location: 'Aracataca, Magdalena',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800'
  },
  {
    id: '2',
    title: 'FILBO 2024: Brasil es el invitado de honor',
    type: 'Ferias',
    excerpt: 'La feria del libro más importante de Bogotá regresa...',
    date: '18 Abr 2024',
    location: 'Corferias, Bogotá',
    image: 'https://images.unsplash.com/photo-1526243128144-62553984ee1a?q=80&w=800'
  }
];

export default function PublicityPage() {
  const [mounted, setMounted] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({ title: '', type: 'Noticias', excerpt: '', image: '', location: '' });
  const [authToken, setAuthToken] = useState('');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!mounted || !authToken) return;
    fetchStats(authToken);
    fetchNews();
  }, [mounted, authToken]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewNews(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news?limit=100');
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const mapped: NewsItem[] = data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        type:
          item.category === 'giras'
            ? 'Giras'
            : item.category === 'ferias'
              ? 'Ferias'
              : item.category === 'lanzamientos'
                ? 'Lanzamientos'
                : item.category === 'entrevistas'
                  ? 'Entrevistas'
                  : 'Noticias',
        excerpt: item.summary || '',
        date: new Date(item.published_at).toLocaleDateString('es-CO'),
        location: item.location || 'Colombia',
        image: item.image_url || `https://picsum.photos/seed/${item.id}/800/400`
      }));
      setNews(mapped);
    } catch (error) {
      // no-op
    }
  };

  const handlePublishNews = async () => {
    if (!newNews.title || !newNews.excerpt || !authToken) return;
    const categoryMap: Record<NewsItem['type'], string> = {
      'Noticias': 'noticias',
      'Giras': 'giras',
      'Ferias': 'ferias',
      'Lanzamientos': 'lanzamientos',
      'Entrevistas': 'entrevistas'
    };

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newNews.title,
          summary: newNews.excerpt,
          content: newNews.excerpt,
          image_url: newNews.image || '',
          location: newNews.location || 'Colombia',
          category: categoryMap[(newNews.type as NewsItem['type']) || 'Noticias']
        })
      });

      if (!response.ok) {
        throw new Error('Error publishing news');
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchNews();
      setNewNews({ title: '', type: 'Noticias', excerpt: '', image: '', location: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar la nota');
    }
  };

  const fetchStats = async (token: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setAdminStats(data);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20 px-4 sm:px-8 lg:px-12">
      <Navigation activeTab="publicidad" />

      <div className="max-w-[1600px] mx-auto pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">CONTENIDO EDITORIAL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white tracking-tighter leading-none">
              Publicidad <span className="text-purple-500 italic">& Magazine.</span>
            </h1>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 gap-3 h-14 px-8 font-black uppercase text-[10px] tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'CONTENIDOS PUBLICADOS', value: news.length, change: 'EN EL ARCHIVO', icon: Newspaper, color: 'text-purple-500' },
              { label: 'COBERTURA ALCANZADA', value: loadingStats ? 'CARGANDO...' : 'MÚLTIPLE MEDIOS', change: 'VISIBILIDAD', icon: Megaphone, color: 'text-purple-500' },
              { label: 'ENGAGEMENT TOTAL', value: adminStats?.totalUsers ?? 0, change: 'LECTORES ACTIVOS', icon: User, color: 'text-purple-500' },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/5 border-white/10 p-8 rounded-[2rem] flex flex-col justify-between group hover:bg-white/10 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{stat.label}</span>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
                  <p className={cn("text-[8px] font-bold uppercase tracking-widest", stat.color)}>✦ {stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Redactor de Magazine */}
          <div className="grid grid-cols-1 xl:grid-cols-[540px_1fr] gap-12">
            <Card className="bg-purple-950/10 border-purple-500/20 text-white rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              {showSuccess && (
                <div className="absolute inset-0 bg-purple-600 flex flex-col items-center justify-center space-y-6 z-30 animate-in fade-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                  <p className="text-xl font-black font-playfair text-white uppercase tracking-widest">Nota Publicada</p>
                </div>
              )}
              <div className="space-y-3">
                <h3 className="text-3xl font-playfair font-black text-white">Redactor del Magazine</h3>
                <p className="text-sm text-white/30 italic font-light">Crea contenidos culturales de alto impacto.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 flex items-center gap-2"><Zap className="w-3 h-3" /> Categoría</Label>
                  <Select onValueChange={(val: any) => setNewNews({...newNews, type: val})} defaultValue={newNews.type}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#0a0a0c] border-white/10 text-white">
                      <SelectItem value="Noticias">Noticias</SelectItem>
                      <SelectItem value="Giras">Giras Literarias</SelectItem>
                      <SelectItem value="Ferias">Ferias del Libro</SelectItem>
                      <SelectItem value="Lanzamientos">Lanzamientos</SelectItem>
                      <SelectItem value="Entrevistas">Entrevistas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Título de la Nota</Label>
                  <Input placeholder="Ej: Nueva FILBo 2024..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Ubicación / Lugar</Label>
                  <Input placeholder="Bogotá, Colombia..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newNews.location} onChange={(e) => setNewNews({...newNews, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Resumen / Entradilla</Label>
                  <Textarea placeholder="Escribe el párrafo introductorio..." className="bg-white/5 border-white/10 rounded-xl min-h-[120px]" value={newNews.excerpt} onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 flex items-center gap-2"><Upload className="w-3 h-3" /> Imagen Destacada</Label>
                  <Input type="file" accept="image/*" onChange={handleImageFileChange} className="bg-white/5 border-white/10 h-12 pt-2.5 rounded-xl cursor-pointer" />
                </div>
                <Button onClick={handlePublishNews} className="w-full bg-purple-600 hover:bg-white hover:text-purple-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]">Publicar Nota</Button>
              </div>
            </Card>
            <div className="space-y-8">
              <h3 className="text-4xl font-playfair font-black text-white border-b border-white/5 pb-6">Archivo Editorial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="bg-white/[0.03] border-white/10 rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.06] transition-all">
                    <div className="relative h-48 w-full">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <Badge className="absolute top-4 left-4 bg-purple-600 border-none text-[8px] font-black">{item.type}</Badge>
                    </div>
                    <div className="p-8 space-y-4">
                      <h4 className="text-xl font-bold text-white leading-tight line-clamp-2">{item.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {item.date}</span>
                        <span className="flex items-center gap-1.5"><Map className="w-3 h-3" /> {item.location}</span>
                      </div>
                      <Button variant="ghost" className="text-purple-400 p-0 hover:bg-transparent hover:text-white text-[10px] font-black uppercase tracking-widest">Editar Contenido →</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

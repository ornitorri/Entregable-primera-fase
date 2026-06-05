'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Bookmark, 
  Filter, 
  ChevronRight, 
  Grid2X2, 
  List, 
  BarChart3, 
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const ARCHIVE_MONTHS = [
  {
    month: 'Enero 2025',
    year: '2025',
    count: 12,
    news: [
      { id: 1, title: 'Balance literario: Lo más leído de 2024', type: 'Otros', date: '30 Ene', img: 'https://picsum.photos/seed/a1/400/400' },
      { id: 2, title: 'Nuevos horizontes para la literatura caribeña', type: 'Gira', date: '25 Ene', img: 'https://picsum.photos/seed/a2/400/400' },
      { id: 3, title: 'Entrevista exclusiva con autores emergentes', type: 'Entrevista', date: '20 Ene', img: 'https://picsum.photos/seed/a3/400/400' },
      { id: 4, title: 'Lanzamiento: Antología de cuentos cortos', type: 'Lanzamiento', date: '15 Ene', img: 'https://picsum.photos/seed/a4/400/400' },
    ]
  }
];

export default function ArchivePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeYear, setActiveYear] = useState('2025');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArchive = useMemo(() => {
    return ARCHIVE_MONTHS.filter(group => group.year === activeYear);
  }, [activeYear]);

  return (
    <main className="min-h-screen bg-transparent pt-nav">
      <Navigation activeTab="noticias" onTabChange={() => {}} />

      <section className="py-16 lg:py-24 border-b border-white/5 relative">
        <div className="absolute inset-0 bg-background/40 backdrop-blur-sm -z-10" />
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="space-y-4 max-w-3xl">
            <Link href="/noticias" className="flex items-center gap-2 text-accent hover:text-white transition-colors font-black text-xs uppercase tracking-widest mb-6">
              <ArrowLeft className="w-4 h-4" /> Volver a Noticias
            </Link>
            <h1 className="text-6xl md:text-7xl font-playfair font-black text-white tracking-tighter">
              Archivo <span className="text-accent italic">Histórico</span>
            </h1>
            <p className="text-xl text-white/60 font-medium italic">
              Explora años de historias, ferias y lanzamientos que han marcado nuestra comunidad literaria.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] shadow-xl flex flex-col lg:flex-row gap-4 items-center backdrop-blur-md">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
              <Input 
                placeholder="Buscar en el archivo..." 
                className="h-14 pl-14 pr-6 rounded-2xl bg-white/5 border-none text-lg text-white"
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Select value={activeYear} onValueChange={setActiveYear}>
                <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5 w-[140px] font-black uppercase text-xs tracking-widest text-white">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className="bg-background border-white/10 text-white">
                  <SelectItem value="2025">Año 2025</SelectItem>
                  <SelectItem value="2024">Año 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-8 space-y-20">
            <div className="border-b border-white/10 flex gap-12 overflow-x-auto no-scrollbar">
              {['2025', '2024', '2023'].map(year => (
                <button 
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={cn(
                    "pb-6 text-2xl font-playfair font-black transition-all relative",
                    activeYear === year ? "text-accent" : "text-white/20 hover:text-white"
                  )}
                >
                  {year}
                  {activeYear === year && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="space-y-24">
              {filteredArchive.map((group, idx) => (
                <section key={idx} className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-4xl font-playfair font-black text-white">{group.month}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {group.news.map((item) => (
                      <div key={item.id} className="group cursor-pointer flex flex-col space-y-4">
                        <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                          <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          <Badge className="absolute top-4 left-4 bg-accent text-white border-none uppercase text-[8px] font-black tracking-widest">
                            {item.type}
                          </Badge>
                        </div>
                        <h3 className="font-playfair font-bold text-white group-hover:text-accent transition-colors leading-tight line-clamp-2">{item.title}</h3>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <Card className="rounded-[2.5rem] p-10 border-white/10 bg-white/[0.03] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><BarChart3 className="w-32 h-32" /></div>
              <div className="relative z-10 space-y-8">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Resumen del Archivo</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-playfair font-black text-accent">248</span>
                  <span className="text-sm font-bold text-white/60 italic">notas publicadas</span>
                </div>
                <div className="space-y-6">
                  {['Lanzamientos', 'Giras', 'Ferias'].map((type, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white">
                        <span>{type}</span>
                        <span className="text-accent">{i === 0 ? '89' : '52'}</span>
                      </div>
                      <Progress value={i === 0 ? 80 : 50} className="h-1.5 bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

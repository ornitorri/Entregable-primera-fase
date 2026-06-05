'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Plus, 
  BarChart3,
  Bookmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const LIBROS_MOCK = [
  { id: 1, titulo: "Cien Años de Soledad", autor: "García Márquez", portada: "https://picsum.photos/seed/cien/400/600", estado: "leyendo", progreso: 65, paginas: 417, paginasActuales: 271, categoria: "Realismo Mágico" },
  { id: 2, titulo: "El Aleph", autor: "Borges", portada: "https://picsum.photos/seed/aleph/400/600", estado: "leido", progreso: 100, paginas: 224, paginasActuales: 224, categoria: "Ficción" },
  { id: 3, titulo: "Rayuela", autor: "Cortázar", portada: "https://picsum.photos/seed/rayuela/400/600", estado: "quiero_leer", progreso: 0, paginas: 635, paginasActuales: 0, categoria: "Ficción" },
  { id: 4, titulo: "1984", autor: "Orwell", portada: "https://picsum.photos/seed/1984/400/600", estado: "leyendo", progreso: 30, paginas: 328, paginasActuales: 98, categoria: "Distopía" },
];

export default function EstantePage() {
  const [activeTab, setActiveTab] = useState('leyendo');

  const stats = {
    total: LIBROS_MOCK.length,
    completados: LIBROS_MOCK.filter(b => b.estado === 'leido').length,
    paginas: 271
  };

  const renderBookCard = (libro: any) => (
    <Card key={libro.id} className="group relative bg-white/[0.04] border-white/[0.08] rounded-[2rem] overflow-hidden hover:bg-white/[0.08] hover:scale-[1.02] transition-all duration-500 shadow-2xl">
      <div className="p-6 space-y-6">
        <div className="flex gap-6">
          <div className="relative w-24 h-36 shrink-0 rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10">
            <Image src={libro.portada} alt={libro.titulo} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-white/10 text-white/40 px-2 py-0.5">
                {libro.categoria}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-accent">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-xl font-playfair font-black text-white leading-tight truncate">{libro.titulo}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{libro.autor}</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {libro.estado === 'leyendo' && (
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
                <span>Página {libro.paginasActuales} de {libro.paginas}</span>
                <span className="text-accent">{libro.progreso}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${libro.progreso}%` }} />
              </div>
            </div>
          )}

          {libro.estado === 'leido' && (
            <div className="flex items-center justify-between">
              <Badge className="bg-sage/20 text-sage border-none text-[9px] font-black px-3 py-1 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 mr-1.5" /> Completado
              </Badge>
              <span className="text-[9px] font-bold text-white/20 uppercase">Marzo 2024</span>
            </div>
          )}

          {libro.estado === 'quiero_leer' && (
            <Button className="w-full bg-white/5 hover:bg-accent text-white rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">
              Empezar a leer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
      <Navigation activeTab="inicio" />

      <div className="max-w-7xl mx-auto pt-16 space-y-16">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-playfair font-black text-white tracking-tighter leading-none">
              Mi <span className="text-accent italic">Estante.</span>
            </h1>
            <p className="text-xl text-white/40 italic font-light">Gestiona tu universo literario personal.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            {[
              { label: "Libros en estante", value: stats.total, icon: BookOpen },
              { label: "Completados", value: stats.completados, icon: CheckCircle2 },
              { label: "Páginas leídas", value: stats.paginas, icon: BarChart3 },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-3xl p-6 px-8">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs & Grid */}
        <Tabs defaultValue="leyendo" className="space-y-12">
          <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] inline-flex">
            <TabsList className="bg-transparent h-auto gap-2">
              {[
                { id: 'leyendo', label: 'Leyendo', count: 2 },
                { id: 'leidos', label: 'Leídos', count: 1 },
                { id: 'quiero_leer', label: 'Quiero leer', count: 1 },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-accent data-[state=active]:text-white transition-all text-white/40"
                >
                  {tab.label} ({tab.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {['leyendo', 'leidos', 'quiero_leer'].map((tabId) => (
            <TabsContent key={tabId} value={tabId} className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {LIBROS_MOCK.filter(b => b.estado === tabId).map(renderBookCard)}
                
                {/* Add New Slot */}
                <button className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/10 rounded-[2rem] min-h-[300px] group hover:border-accent/40 hover:bg-accent/5 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:text-accent transition-all">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white">Añadir Título</span>
                </button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}

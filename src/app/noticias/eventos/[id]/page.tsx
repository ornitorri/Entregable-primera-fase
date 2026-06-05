'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Link as LinkIcon,
  Users,
  ShoppingCart,
  ArrowLeft,
  Info,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

const EVENT_DETAIL = {
  id: 'filbo-2025',
  type: 'Feria Internacional',
  title: 'FILBO 2025: Brasil, País Invitado de Honor',
  banner: 'https://images.unsplash.com/photo-1526243128144-62553984ee1a?q=80&w=2000&auto=format&fit=crop',
  date: '12 - 28 de Abril, 2025',
  time: '09:00 AM - 08:00 PM',
  location: 'Corferias, Bogotá',
  description: `La Feria Internacional del Libro de Bogotá (FILBo) llega a su edición 2025 celebrando la diversidad literaria con Brasil como país invitado de honor. Durante 15 días, el recinto ferial de Corferias se transformará en el epicentro de la cultura, reuniendo a más de 500 expositores y miles de autores nacionales e internacionales.`
};

export default function EventDetailPage() {
  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20">
      <Navigation activeTab="noticias" onTabChange={() => {}} />

      <section className="relative h-[500px] w-full overflow-hidden">
        <Image src={EVENT_DETAIL.banner} alt={EVENT_DETAIL.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-8 left-8 z-20">
          <Link href="/noticias/calendario">
            <Button variant="ghost" className="bg-black/40 backdrop-blur-md text-white hover:bg-white/20 rounded-full border border-white/20 gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12 z-10">
          <div className="space-y-6">
            <Badge className="bg-accent text-white border-none font-bold px-4 py-1.5 uppercase text-[10px] tracking-widest">{EVENT_DETAIL.type}</Badge>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white leading-[1.1] tracking-tighter max-w-4xl">{EVENT_DETAIL.title}</h1>
            <div className="flex flex-wrap items-center gap-8 text-white/80 font-bold uppercase tracking-widest text-xs">
              <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-accent" /> {EVENT_DETAIL.date}</span>
              <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-accent" /> {EVENT_DETAIL.location}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <h2 className="text-3xl font-playfair font-black text-white flex items-center gap-3">
                <Info className="w-6 h-6 text-accent" /> Sobre el evento
              </h2>
              <p className="text-lg text-white/70 leading-relaxed italic font-light">{EVENT_DETAIL.description}</p>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <Card className="rounded-[2.5rem] border-white/10 bg-white/[0.03] p-8 space-y-8 backdrop-blur-md shadow-2xl">
              <h3 className="text-2xl font-playfair font-black text-white">Asistiré</h3>
              <Button className="w-full bg-accent hover:bg-white hover:text-accent text-white rounded-2xl py-8 font-bold text-lg shadow-xl shadow-accent/20 transition-all">
                Guardar en mi agenda
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

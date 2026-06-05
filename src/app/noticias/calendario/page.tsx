'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Bookmark, 
  ArrowRight,
  Star,
  Rocket
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

const EVENTS = [
  { id: 1, day: 12, type: 'Feria', title: 'FILBO 2025: Apertura', time: '09:00 AM', location: 'Corferias, Bogotá', country: 'Colombia' },
  { id: 2, day: 12, type: 'Lanzamiento', title: 'Nueva Antología de Poesía', time: '06:00 PM', location: 'Librería Lerner', country: 'Colombia' },
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarioPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(12);

  return (
    <main className="min-h-screen bg-transparent pt-[68px] pb-20">
      <Navigation activeTab="noticias" onTabChange={() => {}} />

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-playfair font-black text-white tracking-tighter">
            Calendario <span className="text-accent italic">Literario</span>
          </h1>
          <p className="text-xl text-white/60 italic font-light max-w-2xl mx-auto">
            Ferias, giras, lanzamientos y eventos en Colombia y el mundo. No te pierdas ni una página de la agenda cultural.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm backdrop-blur-md">
              <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border-collapse">
                {[...Array(35)].map((_, i) => {
                  const day = i - 1;
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 15;

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "min-h-[120px] p-2 border border-white/5 transition-all cursor-pointer group flex flex-col gap-1",
                        !isCurrentMonth && "bg-black/20 text-white/10 pointer-events-none",
                        isCurrentMonth && "hover:bg-white/5",
                        selectedDay === day && "bg-accent/10 border-accent/20"
                      )}
                    >
                      <div className="flex justify-end pr-1 pt-1">
                        <span className={cn(
                          "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                          isToday ? "bg-accent text-white" : "text-white/40 group-hover:text-white"
                        )}>
                          {isCurrentMonth ? day : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2.5rem] border-white/10 bg-white/[0.03] shadow-sm p-8 backdrop-blur-md">
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Agenda del día</span>
                </div>
                <h3 className="text-4xl font-playfair font-black text-white">
                  {selectedDay} de Abril
                </h3>
              </div>
              <div className="space-y-4">
                {EVENTS.map(ev => (
                  <div key={ev.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                    <Badge className="bg-accent text-white border-none text-[9px] font-black uppercase tracking-widest">{ev.type}</Badge>
                    <h4 className="text-lg font-playfair font-bold text-white leading-tight">{ev.title}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{ev.time} · {ev.location}</p>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

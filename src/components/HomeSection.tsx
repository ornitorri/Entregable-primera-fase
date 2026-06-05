"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Globe, CheckCircle2, ChevronDown } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const HomeSection = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  const imgLibrary = PlaceHolderImages.find(img => img.id === 'feat-library');
  const imgReading = PlaceHolderImages.find(img => img.id === 'feat-reading');
  const imgNature = PlaceHolderImages.find(img => img.id === 'feat-nature');

  const features = [
    { 
      title: "Conexión con libros", 
      desc: "Descubre historias que tocan el alma y despiertan la imaginación en cada página.",
      image: imgLibrary?.imageUrl || "https://picsum.photos/seed/library/600/400"
    },
    { 
      title: "Suscríbete hoy", 
      desc: "Accede a contenido exclusivo y comparte tu amor por la lectura con otros apasionados.",
      image: imgReading?.imageUrl || "https://picsum.photos/seed/reading/600/400"
    },
    { 
      title: "Historias que inspiran", 
      desc: "Explora un universo literario lleno de magia y conexión con la naturaleza.",
      image: imgNature?.imageUrl || "https://picsum.photos/seed/nature-reading/600/400"
    }
  ];

  const stats = [
    { label: "Lectores Activos", value: "+15,000", icon: Users },
    { label: "Títulos en Catálogo", value: "+5,000", icon: BookOpen },
    { label: "Clubes de Lectura", value: "250", icon: Globe },
  ];

  return (
    <div className="space-y-24 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative text-center space-y-8 max-w-4xl mx-auto pt-8">
        {/* Floating Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-[100px] animate-rotate-slow -z-10" />

        <div className={cn(
          "inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full border border-accent/20 mb-4 transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">✦ La comunidad literaria te espera</span>
        </div>

        <div className="space-y-2">
          <h1 className={cn(
            "text-5xl md:text-8xl font-black text-primary leading-[1.05] tracking-tighter transition-all duration-700 delay-200",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Bienvenido a <br />
            <span className="text-accent italic font-serif">READZZI</span>
          </h1>
          <p className={cn(
            "text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic font-light transition-all duration-700 delay-400",
            mounted ? "opacity-100" : "opacity-0"
          )}>
            Tu universo literario personalizado. Historias que conectan almas.
          </p>
        </div>

        <div className={cn(
          "flex flex-wrap justify-center gap-6 pt-6 transition-all duration-700 delay-500",
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <Button size="lg" className="shimmer-btn bg-primary hover:bg-accent text-primary-foreground rounded-full px-12 h-16 text-xl shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95">
            Empezar a leer
            <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary/20 hover:bg-accent/5 rounded-full px-12 h-16 text-xl transition-all hover:-translate-y-1">
            Explorar catálogo
          </Button>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown className="w-8 h-8 text-primary" />
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="hidden xl:block absolute top-[20%] left-[5%] w-48 h-72 animate-float pointer-events-none opacity-20">
        <Image src="https://picsum.photos/seed/h1/300/450" alt="decor" fill className="object-cover rounded-2xl shadow-2xl" />
      </div>
      <div className="hidden xl:block absolute top-[35%] right-[5%] w-48 h-72 animate-float-delayed pointer-events-none opacity-20">
        <Image src="https://picsum.photos/seed/h2/300/450" alt="decor" fill className="object-cover rounded-2xl shadow-2xl" />
      </div>

      {/* Features Section */}
      <div className="pt-20 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-primary font-playfair tracking-tight">Tu historia comienza aquí</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic font-medium">
            Construimos una comunidad apasionada por la lectura y la imaginación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feat, i) => (
            <div key={i} className="group bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-sm border border-border/50 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 transition-all duration-500 flex flex-col">
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src={feat.image} 
                  alt={feat.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-10 space-y-4 flex-1">
                <h3 className="text-2xl font-bold text-primary font-playfair group-hover:text-accent transition-colors">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base italic">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-parchment/50 rounded-[4rem] border border-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 animate-pulse-subtle opacity-30" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto px-6 relative z-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-4 group">
              <div className="bg-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <stat.icon className="w-10 h-10 text-accent" />
              </div>
              <div className="space-y-1">
                <h4 className="text-5xl font-black text-primary font-playfair tracking-tighter">{stat.value}</h4>
                <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-primary font-playfair leading-tight">Nuestra Misión</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic font-light">
              "En <span className="text-accent font-bold">READZZI</span>, creemos que cada libro es una puerta a un nuevo mundo. Nuestra misión es conectar a los lectores con las historias que marcarán sus vidas."
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Acceso democrático a la cultura.",
              "Lectura crítica y reflexiva.",
              "Espacios seguros para el debate.",
              "Apoyo a autores emergentes."
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="bg-accent/10 p-2 rounded-full group-hover:bg-accent transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-cream transition-colors" />
                </div>
                <span className="text-primary font-bold font-dmsans text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-700">
          <Image 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop" 
            alt="Nuestra misión" 
            fill 
            className="object-cover"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-12 px-6 pt-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-primary font-playfair tracking-tight">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground italic">Todo lo que necesitas saber para empezar tu viaje literario.</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { q: "¿Cómo funciona el Plan Embajador?", a: "El Plan Embajador es nuestra suscripción premium más completa. Te permite crear tus propios clubes de lectura y obtener acceso anticipado a los lanzamientos más esperados." },
            { q: "¿Los libros son físicos o digitales?", a: "En READZZI amamos el papel. Nos especializamos en ejemplares físicos de alta calidad, pero al comprarlos, desbloqueas su versión digital en nuestra App." },
            { q: "¿Puedo cancelar mi suscripción?", a: "¡Por supuesto! En READZZI no hay contratos de permanencia. Puedes cancelar o cambiar de plan desde tu perfil en cualquier momento." },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-warm/40 bg-white/20 rounded-[2rem] px-8 py-2 overflow-hidden hover:border-accent/30 transition-colors">
              <AccordionTrigger className="text-xl font-bold text-primary font-playfair hover:no-underline hover:text-accent">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-lg font-light pb-6 italic">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground p-16 md:p-24 rounded-[5rem] text-center space-y-10 shadow-2xl shadow-primary/30 max-w-6xl mx-auto mx-6">
        <div className="absolute inset-0 bg-accent/5 animate-pulse-subtle opacity-20" />
        <h2 className="text-5xl md:text-7xl font-black font-playfair tracking-tighter leading-tight relative z-10">¿Listo para escribir tu <br /> propio capítulo?</h2>
        <p className="text-2xl opacity-80 max-w-2xl mx-auto italic font-light relative z-10">
          Únete a miles de lectores que ya están transformando su forma de vivir la literatura.
        </p>
        <div className="flex justify-center relative z-10">
          <Button size="lg" className="shimmer-btn bg-accent hover:bg-white hover:text-accent text-accent-foreground rounded-full px-16 h-20 text-2xl font-bold shadow-xl shadow-accent/20 transition-all hover:-translate-y-1 active:scale-95">
            Crear cuenta gratis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
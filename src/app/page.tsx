'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  ShoppingCart,
  Eye,
  BookOpen,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const OFFICIAL_LOGO_URL = "https://i.ibb.co/6RJwjLqG/Whats-App-Image-2026-03-31-at-18-47-01-1.png";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const recommendations = [
    { id: "rdz-book-001", title: "LA SOMBRA DEL VIENTO", author: "Carlos Ruiz Zafón", rating: 5, cover: "https://picsum.photos/seed/zafon/400/600", price: "45.000", desc: "Un libro misterioso en el Cementerio de los Libros Olvidados que cambiará la vida de Daniel Sempere para siempre." },
    { id: "rdz-book-002", title: "EL CODIGO DA VINCI", author: "Dan Brown", rating: 5, cover: "https://picsum.photos/seed/dan/400/600", price: "38.000", desc: "Un emocionante thriller conspiranoico sobre el Louvre, sociedades secretas y enigmas ocultos en la historia del arte." },
    { id: "rdz-book-003", title: "HARRY POTTER", author: "J.K. Rowling", rating: 5, cover: "https://picsum.photos/seed/hp/400/600", price: "52.000", desc: "El inicio de la saga del mago más famoso del mundo. Una historia de amistad, valor y magia en Hogwarts." },
    { id: "rdz-book-004", title: "LA CHICA DEL TREN", author: "Paula Hawkins", rating: 5, cover: "https://picsum.photos/seed/girl/400/600", price: "32.000", desc: "Un thriller psicológico absorbente sobre una desaparición misteriosa vista a través de los ojos de tres mujeres." },
    { id: "rdz-book-005", title: "DUNE", author: "Frank Herbert", rating: 5, cover: "https://picsum.photos/seed/dune/400/600", price: "65.000", desc: "La épica de ciencia ficción más importante de todos los tiempos, ambientada en el peligroso planeta Arrakis." },
    { id: "rdz-book-006", title: "1984", author: "George Orwell", rating: 5, cover: "https://picsum.photos/seed/1984/400/600", price: "28.000", desc: "La distopía definitiva sobre la vigilancia total, el control del pensamiento y la pérdida de la libertad individual." },
    { id: "rdz-book-007", title: "CIEN AÑOS DE SOLEDAD", author: "G. García Márquez", rating: 5, cover: "https://picsum.photos/seed/gabo/400/600", price: "85.000", desc: "La obra maestra del realismo mágico colombiano que narra la historia de siete generaciones de la familia Buendía." },
    { id: "rdz-book-008", title: "EL ALQUIMISTA", author: "Paulo Coelho", rating: 5, cover: "https://picsum.photos/seed/coelho/400/600", price: "25.000", desc: "Un viaje espiritual inspirador sobre la búsqueda de los sueños y la escucha del lenguaje del corazón." },
  ];

  return (
    <main className="min-h-screen text-white overflow-x-hidden">
      <Navigation activeTab="inicio" />
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-24 md:pt-32 px-4 sm:px-6">
        <div className="relative z-10 text-center space-y-2 max-w-5xl mx-auto px-2 flex flex-col items-center">
          
          <div className={cn(
            "relative mb-4 transition-opacity duration-1000",
            mounted ? "opacity-100" : "opacity-0"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-purple-500/20 to-accent/20 rounded-full blur-[80px] animate-pulse scale-150" />
            <div className="relative w-48 h-48 md:w-[320px] md:h-[320px] flex items-center justify-center">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="READZZI Logo" 
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </div>

          <div className={cn(
            "flex flex-col items-center transition-all duration-700 delay-300 space-y-4",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="text-7xl md:text-[120px] font-dmsans font-black text-white tracking-tighter leading-none">
              Readzzi
            </h2>
            <p className="text-2xl md:text-4xl font-playfair italic text-white/80 tracking-wide">
              For the Love of Reading
            </p>
          </div>

          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 pt-16 w-full max-w-[320px] sm:max-w-none mx-auto transition-all duration-700 delay-500",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <Link href="/catalogo">
              <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 px-12 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest border-none transition-transform active:scale-95">
                Explorar catálogo
              </Button>
            </Link>
            <Link href="/registro">
              <Button variant="outline" className="w-full sm:w-auto bg-white/5 border-white/20 hover:bg-white/10 text-white px-12 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-transform active:scale-95">
                Unirme ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 px-4 md:px-0">
            <div className="space-y-2 text-left">
              <h2 className="text-4xl md:text-6xl font-playfair font-black text-white">Joyas <span className="text-white/60 italic">del estante.</span></h2>
              <p className="text-white/40 italic text-base">Pasa el cursor para ver detalles. El carrusel se detendrá automáticamente.</p>
            </div>
            <Link href="/catalogo">
              <Button variant="link" className="text-white/60 hover:text-white font-black uppercase text-[10px] tracking-widest p-0 h-auto transition-colors">Ver librería completa →</Button>
            </Link>
          </div>

          <div className="relative px-4 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true, // Crucial: Detiene el carrusel en hover
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-8">
                {recommendations.map((book) => (
                  <CarouselItem key={book.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                    {/* Tarjeta del libro con contenedor de expansión */}
                    <div className="group relative block h-[520px] cursor-pointer perspective-1000">
                      
                      {/* VENTANA EMERGENTE (POPUP INFORMATIVO) - REDISEÑADA TIPO MODAL FLOTANTE */}
                      <div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 ease-out scale-95 group-hover:scale-105">
                        <div className="absolute -inset-6 bg-[#1a1a1e]/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col p-8 space-y-6">
                          
                          {/* Mini Cabecera con Imagen Desenfocada */}
                          <div className="relative h-40 w-full rounded-2xl overflow-hidden shrink-0">
                            <img src={book.cover} className="w-full h-full object-cover blur-sm opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                              <h3 className="text-2xl font-playfair font-black text-white leading-tight uppercase line-clamp-2">
                                {book.title}
                              </h3>
                              <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-1">
                                {book.author}
                              </p>
                            </div>
                          </div>

                          {/* Cuerpo de Información */}
                          <div className="flex-1 space-y-5">
                            <div className="flex items-center justify-between">
                              <div className="flex text-accent gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={`star-${book.id}-${i}`} className="w-4 h-4 fill-current" />)}
                              </div>
                              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                <Info className="w-3 h-3 text-accent" />
                                <span className="text-[8px] font-black uppercase text-white/60">Info Básica</span>
                              </div>
                            </div>

                            <p className="text-xs text-white/70 leading-relaxed italic font-light line-clamp-4">
                              "{book.desc}"
                            </p>

                            <div className="pt-4 border-t border-white/5">
                              <div className="flex justify-between items-end">
                                <div className="space-y-0.5">
                                  <span className="block text-[8px] text-white/30 uppercase font-black tracking-widest leading-none">Precio Especial</span>
                                  <span className="text-3xl font-black text-white tracking-tighter">${book.price}</span>
                                </div>
                                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">COP</span>
                              </div>
                            </div>
                          </div>

                          {/* Botones de Acción */}
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link href={`/catalogo/${book.id}`} className="w-full">
                              <Button className="w-full bg-white text-black hover:bg-accent hover:text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all">
                                <Eye className="w-4 h-4 mr-2" /> Detalles
                              </Button>
                            </Link>
                            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">
                              <Plus className="w-4 h-4 mr-2" /> Mi Estante
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* PORTADA ORIGINAL (SE OCULTA SUAVEMENTE AL ENTRAR EL POPUP) */}
                      <div className="relative aspect-[2/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:opacity-0 ring-1 ring-white/10 bg-black/20">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      </div>

                      {/* INFORMACIÓN DE PIE (VISIBLE SOLO CUANDO NO HAY HOVER) */}
                      <div className="mt-6 space-y-1.5 px-2 group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="font-playfair font-black text-sm uppercase tracking-tight text-white/90 truncate">{book.title}</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">{book.author}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Botones de navegación laterales */}
              <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 h-14 w-14 bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-white hover:text-black rounded-2xl transition-all" />
              <CarouselNext className="hidden md:flex -right-4 lg:-right-12 h-14 w-14 bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-white hover:text-black rounded-2xl transition-all" />
            </Carousel>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

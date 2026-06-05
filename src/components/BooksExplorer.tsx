
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Monitor, 
  Truck, 
  Smartphone, 
  Heart,
  Star,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type Category = 'Todos' | 'Ficción' | 'Realismo Mágico' | 'Fantasía' | 'Misterio' | 'Ciencia Ficción' | 'Ofertas';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: string;
  price: number;
  category: Category;
  image: string;
  oldPrice?: number;
  description?: string;
}

const BooksExplorer = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const books: Book[] = useMemo(() => [
    {
      id: 1,
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      rating: 4.9,
      genre: "Realismo Mágico",
      price: 85.000,
      category: 'Realismo Mágico',
      image: PlaceHolderImages.find(img => img.id === 'book-1')?.imageUrl || 'https://picsum.photos/seed/book1/400/600',
      description: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo..."
    },
    {
      id: 2,
      title: "El Aleph",
      author: "Jorge Luis Borges",
      rating: 4.8,
      genre: "Ficción",
      price: 32.000,
      category: 'Ficción',
      image: PlaceHolderImages.find(img => img.id === 'book-2')?.imageUrl || 'https://picsum.photos/seed/book2/400/600',
      description: "Una colección de cuentos que exploran los límites del infinito, la memoria y el laberinto de la realidad."
    },
    {
      id: 3,
      title: "Rayuela",
      author: "Julio Cortázar",
      rating: 4.7,
      genre: "Ficción",
      price: 38.000,
      category: 'Ficción',
      image: 'https://picsum.photos/seed/rayuela/400/600',
      description: "Una novela revolucionaria que se puede leer de múltiples maneras, desafiando las convenciones literarias."
    },
    {
      id: 4,
      title: "Pedro Páramo",
      author: "Juan Rulfo",
      rating: 4.9,
      genre: "Realismo Mágico",
      price: 28.000,
      category: 'Realismo Mágico',
      image: 'https://picsum.photos/seed/pedro/400/600',
      description: "Un viaje fantasmal al pueblo de Comala, donde la muerte y la vida se entrelazan en un susurro eterno."
    }
  ], []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesCategory = activeCategory === 'Todos' || book.category === activeCategory || book.genre === activeCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(term) || 
        book.genre.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, books]);

  const categories: Category[] = ['Todos', 'Ficción', 'Realismo Mágico', 'Fantasía', 'Misterio', 'Ciencia Ficción', 'Ofertas'];

  const relatedBooks = useMemo(() => {
    if (!selectedBook) return [];
    return books.filter(b => b.genre === selectedBook.genre && b.id !== selectedBook.id);
  }, [selectedBook, books]);

  // Vista de Detalle (Página)
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white -mx-4 sm:-mx-6 lg:-mx-8 -mt-24 px-4 sm:px-10 lg:px-20 pt-32 pb-20 animate-fade-in">
        {/* Botón Volver */}
        <button 
          onClick={() => setSelectedBook(null)}
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight">Volver a la Librería</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Portada */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="relative aspect-[3/4.5] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <Image 
                src={selectedBook.image} 
                alt={selectedBook.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint="book cover"
              />
            </div>
          </div>

          {/* Información Principal */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-full border-white/20 text-accent bg-accent/5 px-5 py-1.5 text-xs font-bold uppercase tracking-widest">
                {selectedBook.genre}
              </Badge>
              <Badge variant="outline" className="rounded-full border-white/20 text-blue-400 bg-blue-400/5 px-5 py-1.5 text-xs font-bold uppercase tracking-widest">
                Edición Tapa Dura
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold font-headline leading-tight tracking-tight">
                {selectedBook.title}
              </h1>
              <div className="flex items-center gap-4 text-white/60 text-xl font-medium italic">
                <span>{selectedBook.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-accent">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="font-bold">{selectedBook.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2 h-14 px-8 text-sm font-bold uppercase tracking-wider">
                <Monitor className="w-5 h-5" />
                Acceso Digital Temporal
              </Button>
            </div>

            <div className="space-y-8 pt-10">
              <div className="flex items-baseline gap-3">
                <span className="text-6xl md:text-7xl font-bold text-accent tracking-tighter">${selectedBook.price.toFixed(3)}</span>
                <span className="text-lg text-white/40 font-bold uppercase tracking-widest">COP</span>
              </div>
              
              <div className="flex flex-wrap gap-5">
                <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-[2rem] h-20 px-12 text-xl font-bold shadow-2xl shadow-purple-500/20 transition-all active:scale-95 group">
                  <ShoppingCart className="w-6 h-6 mr-3 transition-transform group-hover:-translate-y-1" />
                  Comprar Ejemplar
                </Button>
                <Button variant="outline" size="icon" className="rounded-[2rem] w-20 h-20 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  <Heart className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles Secundarios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-24 mt-24 border-t border-white/5">
          {/* Sinopsis */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl font-bold font-headline">Sinopsis Editorial</h2>
            <p className="text-2xl text-white/70 leading-relaxed italic font-body max-w-3xl">
              "{selectedBook.description}"
            </p>
          </div>

          {/* Logística y App */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Truck className="w-6 h-6" />
                <span className="text-sm font-bold uppercase tracking-widest">Logística y Envío</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Envío Premium Asegurado</span>
                  <Badge className="bg-green-500/20 text-green-400 border-none rounded-full px-4 text-[10px] font-bold">GRATIS</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Encuadernación</span>
                  <span className="text-white font-bold">Lujo / Tapa Dura</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-[2.5rem] p-8 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-purple-400">
                <Smartphone className="w-6 h-6" />
                <span className="text-sm font-bold uppercase tracking-widest">Ecosistema Digital</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Al adquirir el formato físico, desbloqueas automáticamente el acceso a nuestra App Companion para continuar tu lectura en cualquier dispositivo.
              </p>
            </div>
          </div>
        </div>

        {/* Libros Relacionados */}
        {relatedBooks.length > 0 && (
          <div className="pt-32 space-y-12">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold font-headline">También podría gustarte</h2>
                <p className="text-white/40 font-medium">Más títulos de {selectedBook.genre}</p>
              </div>
              <Button variant="ghost" className="text-accent hover:bg-accent/10 font-bold uppercase tracking-widest text-xs h-12 px-6 rounded-full">
                Ver todo el género
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {relatedBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="group cursor-pointer space-y-4"
                  onClick={() => {
                    setSelectedBook(book);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    <Image src={book.image} alt={book.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white group-hover:text-accent transition-colors truncate">{book.title}</h3>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista de Cuadrícula (Librería principal)
  return (
    <div className="space-y-12 animate-fade-in py-10 max-w-7xl mx-auto">
      {/* Header Estilo Librería */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-primary font-headline tracking-tight">Librería READZZI</h2>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-muted-foreground font-medium">Conectado a la red de libros física</span>
          </div>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Busca por título o género..." 
            className="pl-11 h-12 bg-secondary/10 border-none rounded-full focus:ring-accent/50 focus:bg-secondary/20 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros Estilo Píldora */}
      <div className="flex items-center gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 text-primary font-bold text-sm border border-transparent hover:border-accent/30 transition-all">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
              activeCategory === cat
                ? "bg-accent/20 text-accent ring-1 ring-accent/50"
                : "bg-secondary/10 text-primary/70 hover:bg-secondary/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Libros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="group cursor-pointer flex flex-col space-y-4"
              onClick={() => {
                setSelectedBook(book);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.02]">
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint="book cover"
                />
              </div>

              <div className="space-y-1 px-2">
                <h3 className="font-bold text-lg text-primary line-clamp-1 group-hover:text-accent transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground/70 font-medium">{book.author}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xl font-bold text-accent tracking-tighter">
                    ${book.price.toFixed(3)}
                  </span>
                  <button className="p-2 rounded-full hover:bg-accent/10 text-primary/50 hover:text-accent transition-all">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-4">
            <Search className="w-12 h-12 text-muted/30 mx-auto" />
            <h3 className="text-2xl font-bold text-primary/70">No encontramos ese título</h3>
            <Button variant="outline" className="rounded-full" onClick={() => { setActiveCategory('Todos'); setSearchTerm(''); }}>
              Ver todo el catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksExplorer;

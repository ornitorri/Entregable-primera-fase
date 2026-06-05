'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import BookCover from '@/components/BookCover';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Grid2X2, 
  List, 
  ShoppingCart,
  Filter,
  Inbox,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { getAuthToken, dispatchCartUpdated } from '@/lib/clientAuth';

interface Book {
  id: string;
  slug: string;
  titulo: string;
  autor: string;
  portada: string;
  precio: number;
  stock: number;
  estado: string;
  genero: string;
}

const CATEGORIES = ["Ficción", "Filosofía", "Negocios", "Historia", "Ciencia", "Fantasía", "Realismo Mágico"];

export default function CatalogoPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Error al cargar libros');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (book.stock === 0) {
      alert('Este libro está agotado');
      return;
    }

    try {
      setAddingId(book.id);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: book.id, quantity: 1 })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al agregar al carrito');
        return;
      }

      dispatchCartUpdated();
      alert(`${book.titulo} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    } finally {
      setAddingId(null);
    }
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => b.titulo.toLowerCase().includes(term) || b.autor.toLowerCase().includes(term));
    }
    if (selectedGenres.length > 0) result = result.filter(b => selectedGenres.includes(b.genero));
    if (statusFilter !== 'todos') result = result.filter(b => b.estado.toLowerCase().includes(statusFilter));
    return result;
  }, [searchTerm, selectedGenres, statusFilter, books]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen text-white pt-[72px] pb-20">
      <Navigation activeTab="tienda" />

      <section className="py-12 md:py-20 px-4 sm:px-8 text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="outline" className="text-accent border-accent/30 font-black uppercase tracking-[0.3em] px-4 py-1 text-[9px]">
            Librería Premium
          </Badge>
          <h1 className="text-4xl md:text-7xl font-playfair font-black text-white tracking-tighter leading-none">
            Descubre tu próxima <span className="text-accent italic">historia.</span>
          </h1>
          <p className="text-base md:text-lg text-white/40 italic font-light max-w-xl mx-auto">
            Explora títulos que conectan con tu alma en nuestra red nacional.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <div className="relative group">
            <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-accent" />
            <Input 
              placeholder="Buscar por título o autor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 md:h-16 pl-14 md:pl-16 pr-8 bg-white/[0.03] border-white/10 rounded-full text-base md:text-lg shadow-2xl focus-visible:ring-accent/30"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
            {CATEGORIES.map(gen => (
              <button 
                key={gen} 
                onClick={() => setSelectedGenres(prev => prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen])}
                className={cn(
                  "px-4 py-2 md:px-6 md:py-2.5 rounded-2xl border transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                  selectedGenres.includes(gen) ? "bg-accent border-accent text-white" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {gen}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-10 sticky top-[92px]">
              <div className="space-y-6">
                <h3 className="font-playfair font-black text-2xl flex items-center gap-3">
                  <Filter className="w-5 h-5 text-accent" /> Refinar
                </h3>
                <RadioGroup value={statusFilter} onValueChange={setStatusFilter} className="gap-4">
                  {["Todos", "Nuevo", "Usado"].map(est => (
                    <div key={est} className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value={est.toLowerCase()} id={est} className="text-accent border-white/20" />
                      <Label htmlFor={est} className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest cursor-pointer">
                        {est}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </aside>

          <section className="flex-1 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 md:p-4 rounded-2xl">
              <span className="text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-widest">
                <strong className="text-accent">{filteredBooks.length}</strong> resultados
              </span>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex gap-1 mr-2">
                  <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={cn("h-9 w-9", viewMode === 'grid' ? "text-accent bg-accent/10" : "text-white/20")}>
                    <Grid2X2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={cn("h-9 w-9", viewMode === 'list' ? "text-accent bg-accent/10" : "text-white/20")}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="lg:hidden h-9 rounded-xl border-white/10 text-white/40 text-[9px] uppercase font-black tracking-widest">
                  <Filter className="w-3 h-3 mr-2" /> Filtros
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Cargando catálogo...</p>
              </div>
            ) : (
              <div className={cn(
                "grid gap-4 sm:gap-6 md:gap-8", 
                viewMode === 'grid' 
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
                  : "grid-cols-1"
              )}>
                {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                  <Link key={book.id} href={`/catalogo/${book.id}`} className={cn(
                    "group bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/[0.06] transition-all duration-500 flex flex-col",
                    viewMode === 'list' && "flex-row items-center p-4 md:p-6 gap-6 md:gap-8"
                  )}>
                    <div className={cn(
                      "relative overflow-hidden shrink-0",
                      viewMode === 'grid' ? "aspect-[2/3] w-full" : "w-24 h-36 md:w-40 md:h-56 rounded-xl md:rounded-2xl"
                    )}>
                      <BookCover src={book.portada} alt={book.titulo} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <Badge className={cn(
                          "px-2 py-0.5 rounded-lg text-[7px] font-black uppercase", 
                          book.estado === 'Nuevo' ? 'bg-sage text-white' : 'bg-accent text-white'
                        )}>
                          {book.estado}
                        </Badge>
                      </div>
                    </div>

                    <div className={cn(
                      "p-4 md:p-6 flex-1 flex flex-col",
                      viewMode === 'list' && "p-0"
                    )}>
                      <div className="space-y-1 md:space-y-2 mb-4">
                        <h3 className="font-playfair font-black text-sm md:text-xl line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                          {book.titulo}
                        </h3>
                        <p className="text-[10px] md:text-xs text-white/40 italic font-medium">
                          {book.autor}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-xs font-black text-accent/40 uppercase tracking-tighter">COP</span>
                          <span className="text-lg md:text-2xl font-black text-white tracking-tighter">
                            ${book.precio.toLocaleString('es-CO')}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          disabled={book.stock === 0 || addingId === book.id}
                          onClick={(e) => handleAddToCart(e, book)}
                          className="h-9 w-9 md:h-12 md:w-12 bg-white/5 hover:bg-accent text-white rounded-xl md:rounded-2xl transition-all disabled:opacity-40"
                        >
                          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                    <Inbox className="w-12 h-12 text-white/10" />
                    <h3 className="text-2xl font-playfair font-bold text-white/60">No encontramos ese título</h3>
                    <Button variant="outline" className="rounded-full" onClick={() => { setStatusFilter('todos'); setSearchTerm(''); setSelectedGenres([]); }}>Ver todo</Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

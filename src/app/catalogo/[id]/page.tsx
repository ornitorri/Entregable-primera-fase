'use client';

import React, { useEffect, useState } from 'react';
import BookCover from '@/components/BookCover';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCcw,
  Plus,
  Minus,
  Share2,
  BookOpen,
  User,
  Calendar,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { getAuthToken, dispatchCartUpdated } from '@/lib/clientAuth';

interface BookDetail {
  id: string;
  slug: string;
  titulo: string;
  autor: string;
  portada: string;
  precio: number;
  stock: number;
  estado: string;
  genero: string;
  rating: number;
  description: string;
  created_at: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) throw new Error('Libro no encontrado');
        const bookData = await response.json();
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Error al cargar el libro');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!book) return;

    try {
      setAddingToCart(true);
      const token = getAuthToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: book.id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al agregar al carrito');
        return;
      }

      dispatchCartUpdated();
      alert('Libro agregado al carrito exitosamente');

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-nav">
        <Navigation activeTab="tienda" />
        <div className="h-[60vh] w-full bg-gradient-to-b from-white/5 to-transparent animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="h-12 bg-white/10 rounded-lg w-1/3 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="h-96 bg-white/10 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-white/10 rounded-lg w-full animate-pulse" />
              <div className="h-6 bg-white/10 rounded-lg w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-background pt-nav flex flex-col">
        <Navigation activeTab="tienda" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-playfair font-black text-white">{error || 'Libro no encontrado'}</h1>
            <Link href="/catalogo" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors font-black text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-nav">
      <Navigation activeTab="tienda" />

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-accent">{book.titulo}</span>
        </nav>
      </div>

      {/* BOOK DETAIL */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT COLUMN - BOOK IMAGE */}
          <div className="space-y-8">
            <div className="relative aspect-[2/3] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/5">
              <BookCover
                src={book.portada}
                alt={book.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* ADDITIONAL IMAGES PLACEHOLDER */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto lg:mx-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white/20" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - BOOK INFO */}
          <div className="space-y-8">

            {/* HEADER INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-accent text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                  {book.genero}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/60 px-3 py-1 font-bold text-[9px]">
                  {book.estado}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight">
                {book.titulo}
              </h1>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-white/80 font-medium">{book.autor}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < book.rating ? "text-yellow-400 fill-current" : "text-white/20"
                      )}
                    />
                  ))}
                  <span className="text-white/60 ml-2">({book.rating})</span>
                </div>
              </div>
            </div>

            {/* PRICE AND STOCK */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-playfair font-black text-accent">
                  ${book.precio.toLocaleString('es-CO')}
                </span>
                <span className="text-white/40 text-sm line-through">
                  ${(book.precio * 1.2).toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className={cn(
                  "font-medium",
                  book.stock > 5 ? "text-green-400" : book.stock > 0 ? "text-yellow-400" : "text-red-400"
                )}>
                  {book.stock > 5 ? 'En stock' : book.stock > 0 ? `Solo ${book.stock} disponibles` : 'Agotado'}
                </span>
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white/80">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-xl border-white/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= book.stock}
                    className="h-10 w-10 rounded-xl border-white/20"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0 || addingToCart}
                  className="flex-1 bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-14 font-black uppercase tracking-widest text-sm gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsInWishlist(!isInWishlist)}
                  className={cn(
                    "h-14 w-14 rounded-2xl border-white/20",
                    isInWishlist ? "text-red-400 border-red-400" : "text-white/60"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
                </Button>
              </div>

              <Button variant="ghost" className="w-full border-white/10 text-white/60 rounded-2xl h-12 font-medium gap-2">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
            </div>

            {/* SHIPPING INFO */}
            <Card className="bg-white/[0.02] border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                Información de envío
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Envío estándar</span>
                  <span className="text-accent font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío express</span>
                  <span>$15.000</span>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Entrega estimada: 3-5 días hábiles
                </p>
              </div>
            </Card>

            {/* GUARANTEES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white/70">Compra segura</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCcw className="w-5 h-5 text-accent" />
                <span className="text-white/70">Devoluciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="mt-20 space-y-12">
          <Separator className="bg-white/10" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* DESCRIPTION */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-playfair font-bold text-white">Descripción</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed">
                  {book.description || 'Sin descripción disponible.'}
                </p>
              </div>
            </div>

            {/* BOOK DETAILS */}
            <div className="space-y-6">
              <h3 className="text-xl font-playfair font-bold text-white">Detalles del libro</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Autor</span>
                  <span className="text-white font-medium">{book.autor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Género</span>
                  <span className="text-white font-medium">{book.genero}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Estado</span>
                  <span className="text-white font-medium">{book.estado}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Stock</span>
                  <span className="text-white font-medium">{book.stock} unidades</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/60">Publicado</span>
                  <span className="text-white font-medium">
                    {new Date(book.created_at).toLocaleDateString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCover from '@/components/BookCover';
import {
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ShoppingBag,
  Lock,
  Package,
  Truck,
  RefreshCcw,
  ArrowLeft,
  Inbox
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { getAuthToken, dispatchCartUpdated } from '@/lib/clientAuth';

interface CartItem {
  id: string;
  slug: string;
  titulo: string;
  autor: string;
  portada: string;
  precio: number;
  cantidad: number;
  estado: string;
  stock: number;
  cart_id: number;
}

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('Debes iniciar sesión para ver tu carrito');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Error al cargar el carrito');
        return;
      }

      const cartItems = await response.json();
      setItems(cartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(bookId);
      return;
    }

    try {
      setUpdating(bookId);
      const token = getAuthToken();

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: bookId,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al actualizar cantidad');
        return;
      }

      // Actualizar el estado local
      setItems(items.map(item =>
        item.id === bookId ? { ...item, cantidad: newQuantity } : item
      ));
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error al actualizar cantidad');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (bookId: string) => {
    try {
      setUpdating(bookId);
      const token = getAuthToken();

      const response = await fetch(`/api/cart?book_id=${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al eliminar item');
        return;
      }

      // Actualizar el estado local
      setItems(items.filter(item => item.id !== bookId));
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error al eliminar item');
    } finally {
      setUpdating(null);
    }
  };

  const shippingCost = 0; // Envío gratis
  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const total = subtotal + shippingCost;

  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20">
      <Navigation activeTab="tienda" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-5xl md:text-8xl font-playfair font-black text-white tracking-tighter leading-none">
              Tu <span className="text-accent italic">Pedido.</span>
            </h1>
            <p className="text-lg text-white/40 italic font-light">Llevas {items.length} artículos en tu carrito literario.</p>
          </div>
          <Link href="/catalogo">
            <Button variant="ghost" className="text-white/40 hover:text-accent font-black uppercase text-[10px] tracking-widest gap-2">
              <ArrowLeft className="w-4 h-4" /> Seguir Comprando
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Cargando tu carrito...</p>
          </div>
        ) : error ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <Inbox className="w-10 h-10 text-red-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Error al cargar el carrito</h3>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LISTA DE ARTÍCULOS */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="bg-white/[0.03] border-white/5 p-6 md:p-8 rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative w-24 h-36 md:w-32 md:h-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                      <BookCover src={item.portada} alt={item.titulo} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div className="space-y-1">
                        <Badge className="bg-accent/20 text-accent border-none text-[8px] font-black uppercase mb-2">{item.estado}</Badge>
                        <h3 className="text-xl md:text-2xl font-playfair font-bold text-white group-hover:text-accent transition-colors leading-tight">{item.titulo}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{item.autor}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={updating === item.id}
                            className="p-1 text-white/20 hover:text-accent disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-black text-white text-sm">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={updating === item.id || item.cantidad >= item.stock}
                            className="p-1 text-white/20 hover:text-accent disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-white/20 tracking-tighter">Precio Unitario</span>
                          <span className="text-lg font-black text-accent">${item.precio.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-4">
                      <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-white/20 tracking-tighter">Subtotal</span>
                        <span className="text-2xl font-black text-white tracking-tighter">${(item.precio * item.cantidad).toFixed(3)}</span>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full text-white/10 hover:text-rust hover:bg-rust/5 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* RESUMEN DE PAGO - RESPONSIVE CORREGIDO */}
            <aside className="lg:col-span-4 sticky top-24">
              <Card className="bg-white/[0.03] border-white/10 rounded-[3rem] p-10 space-y-10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-3xl font-playfair font-black text-white">Resumen.</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black uppercase tracking-widest text-white/30 text-[10px]">Subtotal Artículos</span>
                    <span className="font-bold text-white">${subtotal.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black uppercase tracking-widest text-white/30 text-[10px]">Envío Nacional</span>
                    <span className="font-bold text-sage">${shippingCost.toFixed(3)}</span>
                  </div>
                  <Separator className="bg-white/5" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-accent/60">Total a Pagar</span>
                      <span className="text-5xl font-black text-white tracking-tighter">${total.toFixed(3)}</span>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-white/40 uppercase font-black text-[8px]">COP</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-20 text-xl font-black shadow-2xl shadow-accent/20 transition-all active:scale-95">
                      Proceder al Pago
                    </Button>
                  </Link>
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-widest">
                      <Lock className="w-4 h-4 text-accent" /> Pago 100% Seguro
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-widest">
                      <Package className="w-4 h-4 text-accent" /> Empaque Protegido
                    </div>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[4rem]">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-white/10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-playfair font-black text-white/40">Tu carrito está vacío</h4>
              <p className="text-sm text-white/20 italic max-w-xs mx-auto">Parece que aún no has añadido ninguna historia a tu colección.</p>
            </div>
            <Link href="/catalogo">
              <Button className="bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-widest transition-all">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

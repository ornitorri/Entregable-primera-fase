'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Package,
  DollarSign,
  User,
  LayoutGrid,
  Activity,
  Plus,
  UserCog,
  Truck,
  Mail,
  Newspaper,
  ArrowRight,
  Megaphone,
  ShoppingBag,
  Search,
  Bell,
  Calendar,
  Zap,
  BookOpen,
  Upload,
  Info,
  Building2,
  FileText,
  Eye,
  Layers,
  ChevronRight,
  Star,
  Map,
  Mic2,
  Rocket,
  Download,
  MousePointer2,
  FileJson,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductItem {
  id: any;
  title: string;
  author: string;
  price: string;
  stock: string;
  portada: string;
  synopsis: string;
  editorial: string;
  category: string;
  type: 'Libro' | 'Accesorio' | 'Coleccionable';
  estado: string;
  slug: string;
  isbn?: string;
  year?: string;
  pages?: string;
  language?: string;
  binding?: string;
}

export default function MarketingPage() {
  const [mounted, setMounted] = useState(false);
  const [newBook, setNewBook] = useState<Partial<ProductItem>>({ 
    title: '', author: '', price: '', stock: '', portada: '', synopsis: '', editorial: '', category: 'Ficción', type: 'Libro', isbn: '', year: '', pages: '', language: 'Español', binding: 'Tapa Dura'
  });
  const [books, setBooks] = useState<ProductItem[]>([]);
  const [authToken, setAuthToken] = useState('');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedBooks = localStorage.getItem('readzzi_local_books');
    if (storedBooks) setBooks(JSON.parse(storedBooks));
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!mounted || !authToken) return;
    fetchStats(authToken);
  }, [mounted, authToken]);

  useEffect(() => {
    if (mounted) localStorage.setItem('readzzi_local_books', JSON.stringify(books));
  }, [books, mounted]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewBook(prev => ({ ...prev, portada: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !authToken) return;

    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        price: parseFloat(newBook.price) || 0,
        cover: newBook.portada,
        description: newBook.synopsis,
        categories: newBook.category ? [newBook.category] : []
      };

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al publicar el libro');
        return;
      }

      const result = await response.json();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setNewBook({ title: '', author: '', price: '', stock: '', portada: '', synopsis: '', editorial: '', category: 'Ficción', type: 'Libro', isbn: '', year: '', pages: '', language: 'Español', binding: 'Tapa Dura' });

    } catch (error) {
      console.error('Error publishing book:', error);
      alert('Error al publicar el libro');
    }
  };

  const fetchStats = async (token: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setAdminStats(data);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20 px-4 sm:px-8 lg:px-12">
      <Navigation activeTab="mercadeo" />

      <div className="max-w-[1600px] mx-auto pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GESTIÓN COMERCIAL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white tracking-tighter leading-none">
              Mercadeo <span className="text-emerald-500 italic">& Ventas.</span>
            </h1>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 gap-3 h-14 px-8 font-black uppercase text-[10px] tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'INGRESOS MENSUALES', value: `$${Number(adminStats?.monthlyRevenue?.[0]?.total || 0).toLocaleString('es-CO')}`, change: loadingStats ? 'CARGANDO...' : 'DESDE BASE DE DATOS', icon: DollarSign, color: 'text-emerald-500' },
              { label: 'PRODUCTOS CATÁLOGO', value: books.length, change: 'ÍTEMS ACTIVOS', icon: ShoppingBag, color: 'text-emerald-500' },
              { label: 'PRODUCTOS VENDIDOS', value: adminStats?.activeOrders ?? 0, change: loadingStats ? 'CARGANDO...' : 'EN EJECUCIÓN', icon: Package, color: 'text-emerald-500' },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/5 border-white/10 p-8 rounded-[2rem] flex flex-col justify-between group hover:bg-white/10 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{stat.label}</span>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
                  <p className={cn("text-[8px] font-bold uppercase tracking-widest", stat.color)}>✦ {stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Gestión de Catálogo */}
          <div className="grid grid-cols-1 xl:grid-cols-[540px_1fr] gap-12 items-start">
            <Card className="bg-emerald-950/10 border-emerald-500/20 text-white rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-2xl">
              {showSuccess && (
                <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center space-y-6 z-30 animate-in fade-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                  <p className="text-xl font-black font-playfair text-white uppercase tracking-widest">Producto Registrado</p>
                </div>
              )}
              <div className="space-y-3">
                <h3 className="text-3xl font-playfair font-black text-white">Gestión de Catálogo</h3>
                <p className="text-sm text-white/30 italic font-light">Define la presencia técnica y visual de los productos.</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><LayoutGrid className="w-3 h-3" /> Tipo</Label>
                    <Select onValueChange={(val: any) => setNewBook({...newBook, type: val})} defaultValue={newBook.type}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0a0a0c] border-white/10 text-white">
                        <SelectItem value="Libro">Libro</SelectItem>
                        <SelectItem value="Accesorio">Accesorio</SelectItem>
                        <SelectItem value="Coleccionable">Coleccionable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><Layers className="w-3 h-3" /> Categoría</Label>
                    <Input placeholder="Ficción..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.category} onChange={(e) => setNewBook({...newBook, category: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><BookOpen className="w-3 h-3" /> Título Principal</Label>
                  <Input placeholder="Ej: Cien Años de Soledad" className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><User className="w-3 h-3" /> Autor / Marca</Label>
                    <Input placeholder="Nombre..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><Building2 className="w-3 h-3" /> Editorial</Label>
                    <Input placeholder="Editorial..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.editorial} onChange={(e) => setNewBook({...newBook, editorial: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Precio (COP)</Label>
                    <Input placeholder="85.000" className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.price} onChange={(e) => setNewBook({...newBook, price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><Package className="w-3 h-3" /> Stock Disponible</Label>
                    <Input placeholder="5" className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newBook.stock} onChange={(e) => setNewBook({...newBook, stock: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><FileText className="w-3 h-3" /> Sinopsis Editorial</Label>
                  <Textarea placeholder="Escribe el resumen del libro..." className="bg-white/5 border-white/10 rounded-xl min-h-[120px]" value={newBook.synopsis} onChange={(e) => setNewBook({...newBook, synopsis: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2"><Upload className="w-3 h-3" /> Media de Portada</Label>
                  <Input type="file" accept="image/*" onChange={handleImageFileChange} className="bg-white/5 border-white/10 h-12 pt-2.5 rounded-xl cursor-pointer" />
                </div>
                <Button onClick={handleAddBook} className="w-full bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]">Confirmar Ingreso</Button>
              </div>
            </Card>
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <h3 className="text-4xl font-playfair font-black text-white">Inventario Activo</h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-2 rounded-xl">{books.length} Ítems</Badge>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">
                      <th className="px-8 py-6 text-left">Media</th>
                      <th className="px-8 py-6 text-left">Título</th>
                      <th className="px-8 py-6 text-left">Stock</th>
                      <th className="px-8 py-6 text-left">Precio</th>
                      <th className="px-8 py-6 text-right">Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {books.map((book) => (
                      <tr key={book.id} className="group hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6"><div className="relative w-10 h-14 rounded-md overflow-hidden border border-white/10"><Image src={book.portada} alt="cover" fill className="object-cover" /></div></td>
                        <td className="px-8 py-6"><p className="text-base font-bold text-white">{book.title}</p><Badge variant="outline" className="mt-1 text-[7px] border-white/10 text-white/40 uppercase">{book.type}</Badge></td>
                        <td className="px-8 py-6 text-white text-sm font-black">{book.stock}</td>
                        <td className="px-8 py-6 text-emerald-500 text-base font-black">${book.price}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white/20 hover:text-emerald-500 rounded-xl"><Eye className="w-4 h-4" /></Button>
                              </SheetTrigger>
                              <SheetContent className="bg-[#0a0a0c] border-white/10 text-white w-full sm:max-w-xl overflow-y-auto no-scrollbar">
                                <SheetHeader>
                                  <SheetTitle className="text-3xl font-playfair font-black text-emerald-500">{book.title}</SheetTitle>
                                  <SheetDescription className="text-white/40">Ficha técnica detallada del producto en catálogo.</SheetDescription>
                                </SheetHeader>
                                <div className="mt-8 space-y-10 pb-10">
                                  <div className="relative aspect-[2/3] w-56 mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                                    <Image src={book.portada} alt="cover" fill className="object-cover" />
                                  </div>
                                  <div className="space-y-6">
                                    <h4 className="text-xl font-playfair font-black text-white flex items-center gap-3 border-b border-white/10 pb-4">
                                      <FileText className="w-5 h-5 text-emerald-500" /> Sinopsis Editorial
                                    </h4>
                                    <p className="text-base text-white/70 leading-relaxed italic font-light">{book.synopsis || 'Sin descripción.'}</p>
                                  </div>
                                  <div className="bg-emerald-500/10 p-8 rounded-[2.5rem] border border-emerald-500/20 flex items-center justify-between">
                                    <div className="space-y-1">
                                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Valor Comercial</p>
                                      <p className="text-4xl font-black text-white tracking-tighter">${book.price}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Disponibilidad</p>
                                      <p className="text-sm font-bold text-emerald-400">{book.stock} Unidades</p>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            <Button variant="ghost" size="icon" className="text-white/20 hover:text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

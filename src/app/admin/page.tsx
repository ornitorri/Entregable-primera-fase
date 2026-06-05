
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
  FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import UserManagement from '@/components/admin/UserManagement';
import CreateGroupForm from '@/components/groups/CreateGroupForm';

type StaffRole = 'Administrador' | 'Logística' | 'Mercadeo & Ventas' | 'Publicidad';

interface Order {
  id: string;
  cliente: string;
  libro: string;
  fecha: string;
  status: 'Pendiente' | 'En Proceso' | 'Enviado' | 'Entregado';
  total: string;
}

interface NewsItem {
  id: string;
  title: string;
  type: 'Noticias' | 'Giras' | 'Ferias' | 'Lanzamientos' | 'Entrevistas';
  excerpt: string;
  date: string;
  location: string;
  image: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'Activo' | 'Inactivo';
}

interface AdminStats {
  monthlyRevenue: { month: string; total: number }[];
  activeOrders: number;
  totalUsers: number;
  bannedUsers: number;
  recentOrders: Array<{
    id: number;
    first_name: string;
    last_name: string;
    total_amount: number;
    status: Order['status'];
    created_at: string;
  }>;
}

interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  alias: string;
  role: 'user' | 'admin' | 'logistics' | 'marketing' | 'publicity';
  is_banned: boolean;
  ban_reason?: string;
  created_at: string;
  avatar_url?: string;
}

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

const MOCK_ORDERS: Order[] = [
  { id: 'RDZ-101', cliente: 'Sofía Lectora', libro: 'Cien Años de Soledad', fecha: '12 Mar 2024', status: 'En Proceso', total: '85.000' },
  { id: 'RDZ-102', cliente: 'Carlos Ruiz', libro: 'El Aleph', fecha: '11 Mar 2024', status: 'Pendiente', total: '32.000' },
  { id: 'RDZ-103', cliente: 'Elena Martínez', libro: 'Rayuela', fecha: '10 Mar 2024', status: 'Enviado', total: '45.000' },
  { id: 'RDZ-104', cliente: 'Diego Libros', libro: '1984', fecha: '09 Mar 2024', status: 'Pendiente', total: '28.000' },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Gabo por Colombia: Una ruta por los escenarios de Macondo',
    type: 'Giras',
    excerpt: 'Explora los lugares que inspiraron la obra del Nobel...',
    date: '15 Abr 2024',
    location: 'Aracataca, Magdalena',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800'
  },
  {
    id: '2',
    title: 'FILBO 2024: Brasil es el invitado de honor',
    type: 'Ferias',
    excerpt: 'La feria del libro más importante de Bogotá regresa...',
    date: '18 Abr 2024',
    location: 'Corferias, Bogotá',
    image: 'https://images.unsplash.com/photo-1526243128144-62553984ee1a?q=80&w=800'
  }
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [newBook, setNewBook] = useState<Partial<ProductItem>>({ 
    title: '', author: '', price: '', stock: '', portada: '', synopsis: '', editorial: '', category: 'Ficción', type: 'Libro', isbn: '', year: '', pages: '', language: 'Español', binding: 'Tapa Dura'
  });
  const [books, setBooks] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({ title: '', type: 'Noticias', excerpt: '', image: '', location: '' });
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'Admin Principal', email: 'admin@readzzi.com', role: 'Administrador', status: 'Activo' },
    { id: '2', name: 'Manuel Envíos', email: 'logistica@readzzi.com', role: 'Logística', status: 'Activo' },
    { id: '3', name: 'Kevin Ventas', email: 'ventas@readzzi.com', role: 'Mercadeo & Ventas', status: 'Activo' },
    { id: '4', name: 'Sara Contenidos', email: 'ads@readzzi.com', role: 'Publicidad', status: 'Activo' }
  ]);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({ name: '', email: '', role: 'Logística' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'logistics' | 'marketing' | 'publicity' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<AdminUser[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [loadingStaffCreation, setLoadingStaffCreation] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [publishingBook, setPublishingBook] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedBooks = localStorage.getItem('readzzi_local_books');
    if (storedBooks) setBooks(JSON.parse(storedBooks));
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    const rawUser = localStorage.getItem('user_info');
    setAuthToken(token);
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || !authToken || !userRole) return;
    fetchStats(authToken);
    fetchNews();
    if (userRole === 'admin') {
      fetchUsers(authToken);
    }
    setActiveTab(userRole === 'admin' ? 'dashboard' : userRole === 'logistics' ? 'logistica' : userRole === 'marketing' ? 'mercadeo' : 'publicidad');
  }, [mounted, authToken, userRole]);

  useEffect(() => {
    if (mounted) localStorage.setItem('readzzi_local_books', JSON.stringify(books));
  }, [books, mounted]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'book' | 'news') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'book') {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewNews(prev => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !authToken) return;

    try {
      setPublishingBook(true);
      let coverUrl = newBook.portada || '';

      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);
        const uploadResponse = await fetch('/api/books/upload-cover', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          alert(error.error || 'Error al subir la imagen');
          return;
        }

        const uploadResult = await uploadResponse.json();
        coverUrl = uploadResult.url;
      }

      const bookData = {
        title: newBook.title,
        author: newBook.author,
        price: parseFloat(newBook.price) || 0,
        cover: coverUrl,
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

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setNewBook({ title: '', author: '', price: '', stock: '', portada: '', synopsis: '', editorial: '', category: 'Ficción', type: 'Libro', isbn: '', year: '', pages: '', language: 'Español', binding: 'Tapa Dura' });
      setCoverFile(null);
      setCoverPreview('');
    } catch (error) {
      console.error('Error publishing book:', error);
      alert('Error al publicar el libro');
    } finally {
      setPublishingBook(false);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news?limit=100');
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const mapped: NewsItem[] = data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        type:
          item.category === 'giras'
            ? 'Giras'
            : item.category === 'ferias'
              ? 'Ferias'
              : item.category === 'lanzamientos'
                ? 'Lanzamientos'
                : item.category === 'entrevistas'
                  ? 'Entrevistas'
                  : 'Noticias',
        excerpt: item.summary || '',
        date: new Date(item.published_at).toLocaleDateString('es-CO'),
        location: item.location || 'Colombia',
        image: item.image_url || `https://picsum.photos/seed/${item.id}/800/400`
      }));
      setNews(mapped);
    } catch (error) {
      // no-op
    }
  };

  const handlePublishNews = async () => {
    if (!newNews.title || !newNews.excerpt || !authToken) return;
    const categoryMap: Record<NewsItem['type'], string> = {
      'Noticias': 'noticias',
      'Giras': 'giras',
      'Ferias': 'ferias',
      'Lanzamientos': 'lanzamientos',
      'Entrevistas': 'entrevistas'
    };

    const response = await fetch('/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: newNews.title,
        summary: newNews.excerpt,
        content: newNews.excerpt,
        image_url: newNews.image || '',
        location: newNews.location || 'Colombia',
        category: categoryMap[(newNews.type as NewsItem['type']) || 'Noticias']
      })
    });

    if (!response.ok) return;
    await fetchNews();
    setNewNews({ title: '', type: 'Noticias', excerpt: '', image: '', location: '' });
  };

  const handleUpdateOrderStatus = (orderId: string, direction: 'forward' | 'backward') => {
    const statusOrder: Order['status'][] = ['Pendiente', 'En Proceso', 'Enviado', 'Entregado'];
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const currentIndex = statusOrder.indexOf(o.status);
        const newIndex = direction === 'forward' 
          ? Math.min(currentIndex + 1, statusOrder.length - 1)
          : Math.max(currentIndex - 1, 0);
        return { ...o, status: statusOrder[newIndex] };
      }
      return o;
    }));
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) return;
    const member: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name!,
      email: newStaff.email!,
      role: newStaff.role as StaffRole,
      status: 'Activo'
    };
    setStaff([...staff, member]);
    setNewStaff({ name: '', email: '', role: 'Logística' });
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
      if (Array.isArray(data.recentOrders)) {
        setOrders(
          data.recentOrders.map((o: any) => ({
            id: `RDZ-${o.id}`,
            cliente: `${o.first_name} ${o.last_name}`,
            libro: 'Pedido',
            fecha: new Date(o.created_at).toLocaleDateString('es-CO'),
            status: o.status,
            total: Number(o.total_amount || 0).toLocaleString('es-CO')
          }))
        );
      }
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async (token: string) => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setRegisteredUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleBanUser = async (userId: number, reason: string) => {
    if (!authToken) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ action: 'ban', userId, reason })
    });
    await fetchUsers(authToken);
    await fetchStats(authToken);
  };

  const handleUnbanUser = async (userId: number) => {
    if (!authToken) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ action: 'unban', userId })
    });
    await fetchUsers(authToken);
    await fetchStats(authToken);
  };

  const handleCreateStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaffPassword || !authToken) return;
    const [firstName, ...lastNameParts] = newStaff.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '-';
    const alias = `${(firstName || 'staff').toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-4)}`;
    const roleMap: Record<StaffRole, 'admin' | 'logistics' | 'marketing' | 'publicity'> = {
      'Administrador': 'admin',
      'Logística': 'logistics',
      'Mercadeo & Ventas': 'marketing',
      'Publicidad': 'publicity'
    };

    setLoadingStaffCreation(true);
    try {
      await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: newStaff.email,
          alias,
          password: newStaffPassword,
          role: roleMap[newStaff.role as StaffRole]
        })
      });
      setNewStaff({ name: '', email: '', role: 'Logística' });
      setNewStaffPassword('');
      if (authToken) {
        await fetchUsers(authToken);
      }
    } finally {
      setLoadingStaffCreation(false);
    }
  };

  const canViewTab = (tabId: string) => {
    if (userRole === 'admin') return true;
    if (tabId === 'logistica') return userRole === 'logistics';
    if (tabId === 'mercadeo') return userRole === 'marketing';
    if (tabId === 'publicidad') return userRole === 'publicity';
    return false;
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20 px-4 sm:px-8 lg:px-12">
      <Navigation activeTab="admin" />

      <div className="max-w-[1600px] mx-auto pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">CENTRAL DE OPERACIONES READZZI</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-playfair font-black text-white tracking-tighter leading-none">
              Panel <span className="text-accent italic">Ejecutivo.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-2xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 gap-3 h-14 px-8 font-black uppercase text-[10px] tracking-widest">
                  <Download className="w-4 h-4" /> Cómo Descargar
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#0a0a0c] border-white/10 text-white w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-3xl font-playfair font-black text-accent">Exportar Código</SheetTitle>
                  <SheetDescription className="text-white/40 italic">Instrucciones para llevarte el proyecto a tu PC.</SheetDescription>
                </SheetHeader>
                <div className="mt-10 space-y-8">
                  <div className="bg-white/5 p-6 rounded-3xl space-y-4 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-black text-xs">1</div>
                      <p className="text-sm font-bold">Haz clic derecho en la carpeta <span className="text-accent">STUDIO</span> en el panel izquierdo.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-black text-xs">2</div>
                      <p className="text-sm font-bold">Selecciona la opción <span className="text-accent">"Download"</span>.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-black text-xs">3</div>
                      <p className="text-sm font-bold">Se descargará un archivo <span className="text-accent">.ZIP</span> con todo el proyecto.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Alternativa</h4>
                    <p className="text-xs italic text-white/60">También puedes ir al menú de arriba a la izquierda (3 líneas) y seleccionar <strong>File  Download...</strong></p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/">
              <Button variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 gap-3 h-14 px-8 font-black uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Cerrar Consola
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] overflow-hidden shadow-2xl">
            <TabsList className="bg-transparent h-auto gap-2 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar w-full px-2">
              {[
                { id: 'dashboard', label: 'Inicio', icon: Zap, color: 'data-[state=active]:bg-white data-[state=active]:text-black' },
                { id: 'logistica', label: 'Logística & Pedidos', icon: Truck, color: 'data-[state=active]:bg-blue-600' },
                { id: 'mercadeo', label: 'Mercadeo & Ventas', icon: ShoppingBag, color: 'data-[state=active]:bg-emerald-600' },
                { id: 'publicidad', label: 'Publicidad & Magazine', icon: Megaphone, color: 'data-[state=active]:bg-purple-600' },
                { id: 'staff', label: 'Gestión de Staff', icon: UserCog, color: 'data-[state=active]:bg-accent' },
              ].filter((tab) => canViewTab(tab.id) && (tab.id !== 'staff' || userRole === 'admin')).map((tab) => (
                <TabsTrigger 
                  key={tab.id} value={tab.id}
                  className={cn(
                    "rounded-2xl px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-3 text-white/40 hover:text-white shrink-0",
                    tab.color
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {canViewTab('dashboard') && (
          <TabsContent value="dashboard" className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'INGRESOS MENSUALES', value: `$${Number(adminStats?.monthlyRevenue?.[0]?.total || 0).toLocaleString('es-CO')}`, change: loadingStats ? 'CARGANDO...' : 'DESDE BASE DE DATOS', icon: DollarSign, color: 'text-emerald-500' },
                { label: 'PEDIDOS ACTIVOS', value: adminStats?.activeOrders ?? 0, change: loadingStats ? 'CARGANDO...' : 'EN EJECUCIÓN TÉCNICA', icon: Package, color: 'text-blue-500' },
                { label: 'BASE LECTORES', value: adminStats?.totalUsers ?? 0, change: loadingStats ? 'CARGANDO...' : 'USUARIOS ACTIVOS', icon: User, color: 'text-accent' },
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
            
            {/* GESTIÓN DE GRUPOS LITERARIOS */}
            {userRole === 'admin' && (
              <div className="bg-gradient-to-br from-purple-950/20 to-indigo-950/20 border border-purple-500/20 rounded-[3rem] p-10 space-y-6 shadow-xl hover:border-purple-500/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">📚 Gestión de Grupos Literarios</h3>
                    <p className="text-sm text-white/60">Administra los grupos literarios de la comunidad</p>
                  </div>
                  <Button 
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl px-8 h-12 gap-2 w-full md:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Nuevo Grupo
                  </Button>
                </div>
                <p className="text-xs text-white/40 italic">Con esta herramienta puedes crear nuevos grupos temáticos para que los usuarios se unan y compartan experiencias sobre literatura.</p>
              </div>
            )}
            
            {userRole === 'admin' && (
              <UserManagement
                users={registeredUsers}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
                loading={loadingUsers}
              />
            )}
            
            {/* Modal para crear grupo */}
            <CreateGroupForm
              isOpen={isCreateGroupOpen}
              onClose={() => setIsCreateGroupOpen(false)}
              onSuccess={() => {
                setIsCreateGroupOpen(false);
                // Opcional: mostrar mensaje de éxito
              }}
            />
          </TabsContent>
          )}

          {canViewTab('logistica') && (
          <TabsContent value="logistica" className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(['Pendiente', 'En Proceso', 'Enviado', 'Entregado'] as const).map((status) => (
                <div key={status} className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{status}</h4>
                    <Badge variant="outline" className="text-[8px] border-white/10 text-white/20">{orders.filter(o => o.status === status).length}</Badge>
                  </div>
                  <div className="space-y-4 min-h-[500px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4">
                    {orders.filter(o => o.status === status).map((order) => (
                      <Card key={order.id} className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4 group hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-blue-500/20 text-blue-400 border-none text-[8px] font-black">{order.id}</Badge>
                          <span className="text-[8px] font-bold text-white/20 uppercase">{order.fecha}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{order.libro}</p>
                          <p className="text-[10px] text-white/40 italic">{order.cliente}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateOrderStatus(order.id, 'backward')} className="h-8 w-8 text-white/20 hover:text-white"><ArrowLeft className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateOrderStatus(order.id, 'forward')} className="h-8 w-8 text-white/20 hover:text-accent"><ArrowRight className="w-3 h-3" /></Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          )}

          {canViewTab('mercadeo') && (
          <TabsContent value="mercadeo" className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0">
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
                    <Input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, 'book')} className="bg-white/5 border-white/10 h-12 pt-2.5 rounded-xl cursor-pointer" />
                    {coverPreview && (
                      <div className="relative w-24 h-36 rounded-xl overflow-hidden border border-white/10">
                        <img src={coverPreview} alt="Vista previa" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <Button onClick={handleAddBook} disabled={publishingBook} className="w-full bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px] disabled:opacity-50">
                    {publishingBook ? 'Publicando...' : 'Confirmar Ingreso'}
                  </Button>
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
                          <td className="px-8 py-6 text-accent text-base font-black">${book.price}</td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-white/20 hover:text-accent rounded-xl"><Eye className="w-4 h-4" /></Button>
                                </SheetTrigger>
                                <SheetContent className="bg-[#0a0a0c] border-white/10 text-white w-full sm:max-w-xl overflow-y-auto no-scrollbar">
                                  <SheetHeader>
                                    <SheetTitle className="text-3xl font-playfair font-black text-accent">{book.title}</SheetTitle>
                                    <SheetDescription className="text-white/40">Ficha técnica detallada del producto en catálogo.</SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-8 space-y-10 pb-10">
                                    <div className="relative aspect-[2/3] w-56 mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                                      <Image src={book.portada} alt="cover" fill className="object-cover" />
                                    </div>
                                    <div className="space-y-6">
                                      <h4 className="text-xl font-playfair font-black text-white flex items-center gap-3 border-b border-white/10 pb-4">
                                        <FileText className="w-5 h-5 text-accent" /> Sinopsis Editorial
                                      </h4>
                                      <p className="text-base text-white/70 leading-relaxed italic font-light">{book.synopsis || 'Sin descripción.'}</p>
                                    </div>
                                    <div className="bg-accent/10 p-8 rounded-[2.5rem] border border-accent/20 flex items-center justify-between">
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-black text-accent uppercase tracking-widest">Valor Comercial</p>
                                        <p className="text-4xl font-black text-white tracking-tighter">${book.price}</p>
                                      </div>
                                      <div className="text-right space-y-1">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Disponibilidad</p>
                                        <p className="text-sm font-bold text-sage">{book.stock} Unidades</p>
                                      </div>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                              <Button variant="ghost" size="icon" className="text-white/20 hover:text-rust rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          )}

          {canViewTab('publicidad') && (
          <TabsContent value="publicidad" className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0">
            <div className="grid grid-cols-1 xl:grid-cols-[540px_1fr] gap-12">
              <Card className="bg-purple-950/10 border-purple-500/20 text-white rounded-[3rem] p-10 space-y-8 shadow-2xl">
                <div className="space-y-3">
                  <h3 className="text-3xl font-playfair font-black text-white">Redactor del Magazine</h3>
                  <p className="text-sm text-white/30 italic font-light">Crea contenidos culturales de alto impacto.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 flex items-center gap-2"><Zap className="w-3 h-3" /> Categoría</Label>
                    <Select onValueChange={(val: any) => setNewNews({...newNews, type: val})} defaultValue={newNews.type}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0a0a0c] border-white/10 text-white">
                        <SelectItem value="Noticias">Noticias</SelectItem>
                        <SelectItem value="Giras">Giras Literarias</SelectItem>
                        <SelectItem value="Ferias">Ferias del Libro</SelectItem>
                        <SelectItem value="Lanzamientos">Lanzamientos</SelectItem>
                        <SelectItem value="Entrevistas">Entrevistas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Título de la Nota</Label>
                    <Input placeholder="Ej: Nueva FILBo 2024..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Ubicación / Lugar</Label>
                    <Input placeholder="Bogotá, Colombia..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newNews.location} onChange={(e) => setNewNews({...newNews, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">Resumen / Entradilla</Label>
                    <Textarea placeholder="Escribe el párrafo introductorio..." className="bg-white/5 border-white/10 rounded-xl min-h-[120px]" value={newNews.excerpt} onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 flex items-center gap-2"><Upload className="w-3 h-3" /> Imagen Destacada</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, 'news')} className="bg-white/5 border-white/10 h-12 pt-2.5 rounded-xl cursor-pointer" />
                  </div>
                  <Button onClick={handlePublishNews} className="w-full bg-purple-600 hover:bg-white hover:text-purple-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]">Publicar Nota</Button>
                </div>
              </Card>
              <div className="space-y-8">
                <h3 className="text-4xl font-playfair font-black text-white border-b border-white/5 pb-6">Archivo Editorial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {news.map((item) => (
                    <Card key={item.id} className="bg-white/[0.03] border-white/10 rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.06] transition-all">
                      <div className="relative h-48 w-full">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                        <Badge className="absolute top-4 left-4 bg-purple-600 border-none text-[8px] font-black">{item.type}</Badge>
                      </div>
                      <div className="p-8 space-y-4">
                        <h4 className="text-xl font-bold text-white leading-tight line-clamp-2">{item.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {item.date}</span>
                          <span className="flex items-center gap-1.5"><Map className="w-3 h-3" /> {item.location}</span>
                        </div>
                        <Button variant="ghost" className="text-purple-400 p-0 hover:bg-transparent hover:text-white text-[10px] font-black uppercase tracking-widest">Editar Contenido →</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          )}

          {userRole === 'admin' && (
          <TabsContent value="staff" className="animate-in fade-in slide-in-from-bottom-8 duration-700 m-0">
            <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-12">
              <Card className="bg-accent/5 border-accent/20 text-white rounded-[3rem] p-10 space-y-8 shadow-2xl h-fit">
                <div className="space-y-3">
                  <h3 className="text-3xl font-playfair font-black text-white">Vincular Especialista</h3>
                  <p className="text-sm text-white/30 italic font-light">Asigna roles técnicos al equipo operativo.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Nombre Completo</Label>
                    <Input placeholder="Nombre..." className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Email Corporativo</Label>
                    <Input placeholder="email@readzzi.com" className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Contraseña Inicial</Label>
                    <Input type="password" placeholder="Mínimo 6 caracteres" className="bg-white/5 border-white/10 rounded-xl h-12 px-4" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Departamento</Label>
                    <Select onValueChange={(val: any) => setNewStaff({...newStaff, role: val})} defaultValue={newStaff.role}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0a0a0c] border-white/10 text-white">
                        <SelectItem value="Logística">Logística</SelectItem>
                        <SelectItem value="Mercadeo & Ventas">Mercadeo & Ventas</SelectItem>
                        <SelectItem value="Publicidad">Publicidad</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateStaff} disabled={loadingStaffCreation} className="w-full bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]">
                    {loadingStaffCreation ? 'Creando Cuenta...' : 'Autorizar Acceso'}
                  </Button>
                </div>
              </Card>
              <div className="space-y-8">
                <h3 className="text-4xl font-playfair font-black text-white border-b border-white/5 pb-6">Equipo Autorizado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {staff.map((member) => (
                    <Card key={member.id} className="bg-white/[0.03] border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-white/[0.06] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent font-black text-xl border border-white/10 shadow-inner">{member.name[0]}</div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white">{member.name}</h4>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-accent/20 text-accent px-2">{member.role}</Badge>
                            <span className="text-[10px] font-medium text-white/30">{member.email}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-white/10 hover:text-rust"><Trash2 className="w-4 h-4" /></Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}

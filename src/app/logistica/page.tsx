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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

interface Order {
  id: string;
  cliente: string;
  libro: string;
  fecha: string;
  status: 'Pendiente' | 'En Proceso' | 'Enviado' | 'Entregado';
  total: string;
}

const MOCK_ORDERS: Order[] = [
  { id: 'RDZ-101', cliente: 'Sofía Lectora', libro: 'Cien Años de Soledad', fecha: '12 Mar 2024', status: 'En Proceso', total: '85.000' },
  { id: 'RDZ-102', cliente: 'Carlos Ruiz', libro: 'El Aleph', fecha: '11 Mar 2024', status: 'Pendiente', total: '32.000' },
  { id: 'RDZ-103', cliente: 'Elena Martínez', libro: 'Rayuela', fecha: '10 Mar 2024', status: 'Enviado', total: '45.000' },
  { id: 'RDZ-104', cliente: 'Diego Libros', libro: '1984', fecha: '09 Mar 2024', status: 'Pendiente', total: '28.000' },
];

export default function LogisticsPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [authToken, setAuthToken] = useState('');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!mounted || !authToken) return;
    fetchStats(authToken);
  }, [mounted, authToken]);

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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-20 px-4 sm:px-8 lg:px-12">
      <Navigation activeTab="logistica" />

      <div className="max-w-[1600px] mx-auto pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">GESTIÓN DE LOGÍSTICA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white tracking-tighter leading-none">
              Logística <span className="text-blue-500 italic">& Pedidos.</span>
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
              { label: 'PEDIDOS PENDIENTES', value: orders.filter(o => o.status === 'Pendiente').length, change: 'POR PROCESAR', icon: Package, color: 'text-blue-500' },
              { label: 'EN TRÁNSITO', value: orders.filter(o => o.status === 'En Proceso' || o.status === 'Enviado').length, change: 'EN EJECUCIÓN', icon: Truck, color: 'text-amber-500' },
              { label: 'ENTREGADOS', value: orders.filter(o => o.status === 'Entregado').length, change: 'COMPLETADOS', icon: CheckCircle2, color: 'text-emerald-500' },
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

          {/* Tablero Kanban */}
          <div className="space-y-8">
            <h3 className="text-4xl font-playfair font-black text-white border-b border-white/5 pb-6">Flujo de Pedidos en Tiempo Real</h3>
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
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateOrderStatus(order.id, 'forward')} className="h-8 w-8 text-white/20 hover:text-blue-500"><ArrowRight className="w-3 h-3" /></Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

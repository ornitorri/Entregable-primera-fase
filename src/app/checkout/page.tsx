'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCover from '@/components/BookCover';
import {
  ChevronRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';
import { amountFromPoints } from '@/lib/points';
import { getAuthToken, dispatchCartUpdated } from '@/lib/clientAuth';

interface CartItem {
  id: string;
  titulo: string;
  autor: string;
  portada: string;
  precio: number;
  cantidad: number;
}

interface ShippingForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string;
}

interface PaymentForm {
  metodoPago: 'tarjeta' | 'pse';
  nombreTarjeta?: string;
  numeroTarjeta?: string;
  vencimiento?: string;
  cvv?: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'envio' | 'pago' | 'exito'>('envio');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [applyPoints, setApplyPoints] = useState<number>(0);

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: ''
  });

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    metodoPago: 'tarjeta'
  });

  // Cálculos del carrito
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const iva = Math.round(subtotal * 0.19); // 19% IVA en Colombia
  const total = subtotal + iva;

  useEffect(() => {
    fetchCartItems();
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch('/api/user/points', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setUserPoints(data.points || 0);
    } catch (err) {
      console.error('Error fetching user points', err);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        alert('Debes iniciar sesión para proceder al checkout');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        alert('Error al cargar el carrito');
        return;
      }

      const items = await response.json();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar campos requeridos
    const required = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'ciudad', 'departamento'];
    const missing = required.filter(field => !shippingForm[field as keyof ShippingForm]);

    if (missing.length > 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setStep('pago');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = getAuthToken();

      const orderData = {
        shipping_address: `${shippingForm.direccion}, ${shippingForm.ciudad}, ${shippingForm.departamento} ${shippingForm.codigoPostal}`,
        payment_method: paymentForm.metodoPago,
        applied_points: applyPoints || 0
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al procesar el pedido');
        return;
      }

      const result = await response.json();
      setOrderId(result.orderId);
      if (result.pointsEarned) setPointsEarned(result.pointsEarned);
      dispatchCartUpdated();
      setStep('exito');

      // refresh user points after order
      fetchUserPoints();

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (step === 'exito') {
    return (
      <main className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center space-y-10 animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-sage" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-playfair font-black text-primary">¡Pedido confirmado!</h1>
            <p className="text-xl text-muted-foreground italic font-light">
              Gracias por tu compra. Hemos enviado el recibo a tu correo electrónico. Tu viaje literario está por comenzar.
            </p>
          </div>
          {pointsEarned > 0 && (
            <div className="text-center">
              <p className="text-lg font-bold text-sage">¡Has ganado {pointsEarned} puntos!</p>
              <p className="text-sm text-white/70">Los puntos se han agregado a tu cuenta y podrás canjearlos en futuras compras o en la tienda de perfiles.</p>
            </div>
          )}
          <div className="bg-parchment/50 border border-warm/40 rounded-[2.5rem] p-8 space-y-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted">
              <span>Nº de Pedido</span>
              <span className="text-primary">#{orderId || 'RDZ-XXXX'}</span>
            </div>
            <Separator className="bg-warm/40" />
            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted">
              <span>Entrega estimada</span>
              <span className="text-sage">3-5 días hábiles</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/comunidad">
              <Button className="w-full bg-primary hover:bg-accent text-cream rounded-2xl h-16 font-bold text-lg shadow-xl">
                Ir a la Comunidad
              </Button>
            </Link>
            <Link href="/catalogo">
              <Button variant="ghost" className="w-full text-muted hover:text-primary font-bold">
                Seguir Comprando
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <Navigation activeTab="tienda" onTabChange={() => {}} />

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Cargando checkout...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-white/40" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Tu carrito está vacío</h3>
              <p className="text-white/60 text-sm">Agrega algunos libros antes de proceder al checkout</p>
            </div>
            <Link href="/catalogo">
              <Button className="bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-12 font-black uppercase tracking-widest text-sm">
                Ir al Catálogo
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Header simple */}
            <div className="mb-12 flex items-center justify-between">
              <Link href="/carrito" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-dmsans font-bold text-sm uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Volver al carrito
              </Link>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">
                <span className={cn(step === 'envio' ? "text-accent" : "text-sage")}>1. Envío</span>
                <ChevronRight className="w-3 h-3" />
                <span className={cn(step === 'pago' ? "text-accent" : "opacity-50")}>2. Pago</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div className="lg:col-span-7 space-y-12">
            <h1 className="text-5xl font-playfair font-black text-primary">
              {step === 'envio' ? 'Detalles de envío' : 'Información de pago'}
            </h1>

            {step === 'envio' ? (
              <form onSubmit={handleShippingSubmit} className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-[10px] font-black uppercase tracking-widest text-muted">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Sofía"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.nombre}
                      onChange={(e) => setShippingForm({...shippingForm, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-[10px] font-black uppercase tracking-widest text-muted">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Lectora"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.apellido}
                      onChange={(e) => setShippingForm({...shippingForm, apellido: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sofia@readzzi.com"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-[10px] font-black uppercase tracking-widest text-muted">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="300 123 4567"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.telefono}
                      onChange={(e) => setShippingForm({...shippingForm, telefono: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-[10px] font-black uppercase tracking-widest text-muted">Dirección de entrega</Label>
                  <Input
                    id="direccion"
                    placeholder="Calle 100 # 15-20, Apto 402"
                    className="h-14 rounded-xl border-warm/60 bg-card"
                    value={shippingForm.direccion}
                    onChange={(e) => setShippingForm({...shippingForm, direccion: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-[10px] font-black uppercase tracking-widest text-muted">Ciudad</Label>
                    <Input
                      id="ciudad"
                      placeholder="Bogotá"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.ciudad}
                      onChange={(e) => setShippingForm({...shippingForm, ciudad: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento" className="text-[10px] font-black uppercase tracking-widest text-muted">Departamento</Label>
                    <Input
                      id="departamento"
                      placeholder="Cundinamarca"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.departamento}
                      onChange={(e) => setShippingForm({...shippingForm, departamento: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal" className="text-[10px] font-black uppercase tracking-widest text-muted">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      placeholder="110111"
                      className="h-14 rounded-xl border-warm/60 bg-card"
                      value={shippingForm.codigoPostal}
                      onChange={(e) => setShippingForm({...shippingForm, codigoPostal: e.target.value})}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-accent text-cream rounded-2xl h-16 font-bold text-lg shadow-xl">
                  Continuar al pago
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-parchment/30 border border-warm/40 rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-playfair font-bold text-xl text-primary">Método de pago</h3>
                    <div className="flex gap-2 grayscale opacity-60">
                      <div className="w-8 h-5 bg-muted rounded" />
                      <div className="w-8 h-5 bg-muted rounded" />
                      <div className="w-8 h-5 bg-muted rounded" />
                    </div>
                  </div>

                  <RadioGroup
                    value={paymentForm.metodoPago}
                    onValueChange={(value) => setPaymentForm({...paymentForm, metodoPago: value})}
                    className="gap-4"
                  >
                    <div className="flex items-center space-x-4 p-4 border border-accent/20 bg-accent/5 rounded-xl">
                      <RadioGroupItem value="tarjeta" id="tarjeta" className="text-accent" />
                      <Label htmlFor="tarjeta" className="font-bold flex-1 cursor-pointer">Tarjeta de Crédito / Débito</Label>
                      <CreditCard className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center space-x-4 p-4 border border-warm/60 rounded-xl hover:bg-parchment/30 transition-all">
                      <RadioGroupItem value="pse" id="pse" />
                      <Label htmlFor="pse" className="font-bold flex-1 cursor-pointer">PSE (Transferencia bancaria)</Label>
                      <div className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">PSE</div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentForm.metodoPago === 'tarjeta' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-name" className="text-[10px] font-black uppercase tracking-widest text-muted">Nombre en la tarjeta</Label>
                      <Input
                        id="card-name"
                        placeholder="SOFIA LECTORA"
                        className="h-14 rounded-xl border-warm/60 bg-card"
                        value={paymentForm.nombreTarjeta || ''}
                        onChange={(e) => setPaymentForm({...paymentForm, nombreTarjeta: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-number" className="text-[10px] font-black uppercase tracking-widest text-muted">Número de tarjeta</Label>
                      <Input
                        id="card-number"
                        placeholder="**** **** **** 4422"
                        className="h-14 rounded-xl border-warm/60 bg-card"
                        value={paymentForm.numeroTarjeta || ''}
                        onChange={(e) => setPaymentForm({...paymentForm, numeroTarjeta: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="exp" className="text-[10px] font-black uppercase tracking-widest text-muted">Vencimiento</Label>
                        <Input
                          id="exp"
                          placeholder="MM/AA"
                          className="h-14 rounded-xl border-warm/60 bg-card"
                          value={paymentForm.vencimiento || ''}
                          onChange={(e) => setPaymentForm({...paymentForm, vencimiento: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-[10px] font-black uppercase tracking-widest text-muted">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="h-14 rounded-xl border-warm/60 bg-card"
                          value={paymentForm.cvv || ''}
                          onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('envio')}
                    className="flex-1 h-16 rounded-2xl border-warm/60 hover:bg-parchment/30"
                  >
                    ← Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-accent hover:bg-primary text-white rounded-2xl h-16 font-bold text-lg shadow-xl disabled:opacity-50"
                  >
                    {processing ? 'Procesando...' : `Pagar $${total.toLocaleString()}`}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <Card className="rounded-[3rem] border border-warm/40 bg-card overflow-hidden shadow-sm">
                <div className="p-10 space-y-8">
                  <h3 className="text-2xl font-playfair font-bold text-primary">Resumen del pedido</h3>
                  
                  {/* Items */}
                  <div className="space-y-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-sm">
                          <BookCover src={item.portada} alt={item.titulo} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-bold text-primary text-sm truncate">{item.titulo}</h4>
                          <p className="text-xs text-muted-foreground italic">{item.autor}</p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-black">Cant: {item.cantidad}</span>
                            <span className="text-sm font-bold text-accent">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-warm/40" />

                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Envío nacional</span>
                      <span className="text-sage font-bold">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Impuestos (IVA)</span>
                      <span>${iva.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-warm/40" />
                    <div className="flex justify-between items-end pt-2">
                      <span className="font-black text-primary text-lg">Total</span>
                      <span className="text-4xl font-black text-amber">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-parchment/50 p-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase tracking-widest text-primary">Envío Asegurado</p>
                    <p className="text-[10px] font-bold text-muted italic">Empaque especial para libros incluido.</p>
                  </div>
                </div>
              </Card>

              {/* Sellos de confianza */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-warm/40 rounded-2xl p-4 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pago Seguro</span>
                </div>
                <div className="bg-card border border-warm/40 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Garantía total</span>
                </div>
              </div>
                {/* Aplicar puntos */}
                <div className="bg-parchment/30 border border-warm/40 rounded-[2.5rem] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">Tus puntos disponibles</div>
                      <div className="text-lg font-black text-white">{userPoints}</div>
                    </div>
                    <div className="text-right text-sm text-white/60">
                      <div>Equivalen a <span className="font-bold">${amountFromPoints(userPoints).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="number"
                      min={0}
                      max={userPoints}
                      value={applyPoints || ''}
                      onChange={(e) => setApplyPoints(Math.max(0, Number(e.target.value || 0)))}
                      placeholder="Puntos a aplicar"
                      className="col-span-2 bg-black/20 border border-white/5 rounded-xl p-3 text-white"
                    />
                    <div className="flex items-center">
                      <div className="text-sm">Descuento: <span className="font-bold">${amountFromPoints(applyPoints || 0).toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </main>
  );
}

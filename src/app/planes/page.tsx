
'use client';

import React, { useState } from 'react';
import { Check, X, Crown, Zap, Shield, Lock, CreditCard, MapPin, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'gratis',
    name: 'Plan Gratuito',
    price: '0',
    description: 'Gratis para siempre',
    icon: Shield,
    badge: 'Básico',
    benefits: [
      { text: 'Acceso al catálogo completo', included: true },
      { text: 'Ver noticias y eventos', included: true },
      { text: 'Comunidad básica (solo lectura)', included: true },
      { text: 'Perfil público', included: true },
      { text: 'Reseñar libros comprados', included: true },
      { text: 'Sin descuentos en compras', included: false },
      { text: 'Sin acceso a grupos privados', included: false },
      { text: 'Sin crear grupos', included: false },
    ],
    cta: 'Comenzar gratis',
    variant: 'outline' as const,
    theme: 'dark'
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '29.900',
    annualPrice: '23.900',
    description: 'Cancela cuando quieras · Sin compromisos',
    icon: Zap,
    badge: 'Más popular',
    featured: true,
    benefits: [
      { text: '10% descuento en todos los libros', included: true },
      { text: 'Envío express prioritario', included: true },
      { text: 'Acceso completo a la comunidad', included: true },
      { text: 'Unirse a grupos privados', included: true },
      { text: 'Acceso anticipado a lanzamientos', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: 'Suscribirme a Premium',
    variant: 'default' as const,
    theme: 'amber'
  },
  {
    id: 'embajador',
    name: 'Plan Embajador',
    price: '59.900',
    annualPrice: '47.900',
    description: 'Cancela cuando quieras',
    icon: Crown,
    badge: 'Para líderes lectores',
    benefits: [
      { text: 'Todo lo del plan Premium', included: true },
      { text: '15% descuento en todos los libros', included: true },
      { text: 'Envío gratis en pedidos +$50.000', included: true },
      { text: 'Crear hasta 5 grupos propios', included: true },
      { text: 'Gestionar miembros de sus grupos', included: true },
      { text: 'Acceso anticipado a ferias y eventos', included: true },
      { text: 'Newsletter exclusivo de embajadores', included: true },
    ],
    cta: 'Convertirme en Embajador',
    variant: 'default' as const,
    theme: 'dark'
  }
];

export default function PlanesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <main className="min-h-screen pt-nav bg-background">
      <Navigation activeTab="subscripciones" />

      {/* Header Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in slide-in-from-top duration-700">
            Elige tu plan
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-dmsans italic max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700 delay-100">
            Únete a la comunidad lectora más grande de Colombia y desbloquea beneficios exclusivos.
          </p>

          {/* Billing Toggle */}
          <div className="flex flex-col items-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="relative flex items-center bg-white/5 p-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  "relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all uppercase tracking-widest min-w-[140px]",
                  billingCycle === 'monthly' ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                Mensual
                {billingCycle === 'monthly' && (
                  <div className="absolute inset-0 bg-accent rounded-full -z-10 shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200" />
                )}
              </button>
              
              <button 
                onClick={() => setBillingCycle('annually')}
                className={cn(
                  "relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all uppercase tracking-widest min-w-[140px]",
                  billingCycle === 'annually' ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                Anual
                {billingCycle === 'annually' && (
                  <div className="absolute inset-0 bg-accent rounded-full -z-10 shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200" />
                )}
                
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <Badge className="bg-sage text-white border-none text-[10px] font-bold px-3 py-1 whitespace-nowrap shadow-lg animate-bounce">
                    🎉 2 meses gratis
                  </Badge>
                  <div className="w-2 h-2 bg-sage rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 -z-10" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "relative flex flex-col h-full rounded-[3rem] p-10 transition-all duration-500 hover:-translate-y-2 group backdrop-blur-xl border",
                plan.featured 
                  ? "bg-accent/10 border-accent scale-105 z-20 shadow-2xl shadow-accent/30" 
                  : "bg-white/[0.03] border-white/10 shadow-sm"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-1.5 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase shadow-xl">
                  {plan.badge}
                </div>
              )}
              
              {!plan.featured && plan.badge && (
                <Badge variant="outline" className="self-start mb-6 font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-xl border-white/20 text-white/60">
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-10 space-y-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3",
                  plan.featured ? "bg-accent text-white" : "bg-white/10 text-accent"
                )}>
                  <plan.icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black font-playfair tracking-tight text-white">
                  {plan.name}
                </h3>
                <div className="flex flex-col text-white">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-white">
                      ${billingCycle === 'annually' && plan.annualPrice ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-sm font-bold opacity-60">/ mes</span>
                  </div>
                  {plan.price !== '0' && (
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">
                      Facturado {billingCycle === 'monthly' ? 'mensualmente' : 'anualmente'}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 flex-1 mb-10">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium">
                    {benefit.included ? (
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                    ) : (
                      <X className="w-4 h-4 mt-0.5 shrink-0 opacity-30 text-white" />
                    )}
                    <span className={cn(
                      "text-white/90",
                      !benefit.included && "opacity-30 line-through"
                    )}>
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <Button 
                  className={cn(
                    "w-full rounded-2xl py-8 font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95",
                    plan.featured 
                      ? "bg-accent hover:bg-white hover:text-accent text-white border-none" 
                      : plan.id === 'embajador'
                        ? "bg-white text-black hover:bg-accent hover:text-white"
                        : "border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-white"
                  )}
                >
                  {plan.cta}
                </Button>
                <p className="text-[10px] text-center font-bold uppercase tracking-widest text-white/40">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white font-playfair tracking-tight">Preguntas frecuentes</h2>
          <p className="text-white/60 font-dmsans italic">Todo lo que necesitas saber antes de suscribirte.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { 
              q: "¿Puedo cambiar de plan en cualquier momento?", 
              a: "Sí, puedes subir o bajar de categoría de plan cuando lo desees desde tu panel de usuario. El cambio se aplicará inmediatamente o al final del periodo de facturación actual según el ajuste." 
            },
            { 
              q: "¿Cómo funciona el descuento en libros físicos?", 
              a: "Una vez suscrito a un plan Premium o Embajador, verás los precios con descuento aplicados automáticamente en todo el catálogo. Al proceder al pago, el sistema reconocerá tu estatus de miembro." 
            },
            { 
              q: "¿Qué pasa si cancelo mi suscripción?", 
              a: "Seguirás teniendo acceso a tus beneficios hasta que finalice el periodo que ya pagaste. Después de eso, tu cuenta volverá al Plan Gratuito." 
            }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-[2rem] px-8 py-2 overflow-hidden hover:border-accent/30 transition-colors bg-white/5 backdrop-blur-md">
              <AccordionTrigger className="text-xl font-bold text-white font-playfair hover:no-underline hover:text-accent py-6 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/60 leading-relaxed text-lg font-dmsans italic pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Trust Section */}
      <section className="bg-white/5 py-16 border-y border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { i: Lock, t: "Pagos seguros con PayU" },
              { i: MapPin, t: "Plataforma 100% colombiana" },
              { i: RefreshCcw, t: "Cancela cuando quieras" },
              { i: CreditCard, t: "Acepta todas las tarjetas" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.i className="w-6 h-6 text-accent" />
                </div>
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

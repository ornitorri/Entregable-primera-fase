
"use client";

import React from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SubscriptionsInfo = () => {
  const plans = [
    {
      name: "Plan Básico",
      price: "Gratis",
      icon: Shield,
      features: [
        "Visualizar libros", 
        "Ver reseñas de la comunidad"
      ],
      cta: "Empezar Gratis",
      popular: false
    },
    {
      name: "Plan Premium",
      price: "€9.99/mes",
      icon: Zap,
      features: [
        "Entrar a grupos de administradores", 
        "Entrar a grupos de Embajadores",
        "Sin anuncios"
      ],
      cta: "Suscribirse ahora",
      popular: true
    },
    {
      name: "Plan Embajador",
      price: "€19.99/mes",
      icon: Crown,
      features: [
        "Todo lo del Plan Premium", 
        "Crear tus propios grupos", 
        "Acceso anticipado a libros"
      ],
      cta: "Ir a Embajador",
      popular: false
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto py-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-primary font-headline tracking-tight">Planes de Suscripción</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg italic">
          Elige el plan que mejor se adapte a tu ritmo de lectura y desbloquea el potencial de READZZI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={cn(
              "relative bg-card/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-border/50 transition-all duration-500 flex flex-col group hover:shadow-2xl hover:-translate-y-2",
              plan.popular ? "shadow-2xl border-accent ring-1 ring-accent/20 z-10 scale-105" : "shadow-sm"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-6 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-accent/20">
                Más popular
              </div>
            )}
            
            <div className="mb-8">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner",
                plan.popular ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
              )}>
                <plan.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary font-headline">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-primary tracking-tighter">{plan.price}</span>
              </div>
            </div>

            <ul className="space-y-5 mb-10 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground group/item">
                  <div className="mt-1 bg-accent/10 rounded-full p-0.5 group-hover/item:bg-accent group-hover/item:text-accent-foreground transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium leading-tight">{feat}</span>
                </li>
              ))}
            </ul>

            <Button 
              className={cn(
                "w-full rounded-2xl py-8 font-bold text-lg shadow-lg transition-all active:scale-95",
                plan.popular 
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent/20" 
                  : "bg-primary text-primary-foreground hover:bg-accent shadow-primary/10"
              )}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsInfo;

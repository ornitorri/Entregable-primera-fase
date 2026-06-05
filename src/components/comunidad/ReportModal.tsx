'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ReportModalProps {
  children: React.ReactNode;
  contentPreview: {
    user: string;
    avatar: string;
    text: string;
  };
}

export default function ReportModal({ children, contentPreview }: ReportModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [reason, setReason] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    setStep('success');
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('form');
      setReason('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[460px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl bg-background">
        <div className="p-8">
          {step === 'form' ? (
            <div className="space-y-6">
              <DialogHeader className="flex-row items-center justify-between space-y-0">
                <DialogTitle className="text-3xl font-playfair font-black text-foreground">Reportar contenido</DialogTitle>
              </DialogHeader>

              {/* Preview del contenido */}
              <div className="bg-parchment/50 border border-warm/40 rounded-2xl p-4 flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={contentPreview.avatar} alt={contentPreview.user} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">{contentPreview.user}</p>
                  <p className="text-xs text-muted-foreground italic line-clamp-1">"{contentPreview.text}"</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground">¿Por qué reportas este contenido?</p>
                <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
                  {[
                    "Contenido inapropiado u ofensivo",
                    "Spam o publicidad no deseada",
                    "Información falsa o engañosa",
                    "Acoso o intimidación",
                    "Contenido fuera del tema del grupo",
                    "Violación de derechos de autor",
                    "Otro motivo"
                  ].map((option) => (
                    <div 
                      key={option}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer group hover:bg-accent/5",
                        reason === option ? "border-accent bg-accent/10" : "border-warm/60"
                      )}
                      onClick={() => setReason(option)}
                    >
                      <RadioGroupItem value={option} id={option} className="text-accent border-accent/40" />
                      <Label htmlFor={option} className="text-sm font-medium cursor-pointer flex-1 group-hover:text-foreground transition-colors">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {reason === "Otro motivo" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Textarea 
                    placeholder="Describe el problema..." 
                    className="rounded-xl border-warm/60 focus-visible:ring-accent/30 min-h-[100px] bg-card text-foreground"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3 p-1">
                <Checkbox id="block" className="border-warm/60 data-[state=checked]:bg-rust data-[state=checked]:border-rust" />
                <Label htmlFor="block" className="text-xs font-bold text-muted-foreground cursor-pointer">
                  Bloquear también a este usuario
                </Label>
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-xl h-12 text-muted-foreground font-bold uppercase tracking-widest text-xs border border-warm/40"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 rounded-xl h-12 bg-rust hover:bg-rust/90 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-rust/20"
                  onClick={handleSubmit}
                  disabled={!reason}
                >
                  Enviar reporte
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-sage" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-playfair font-black text-foreground">Reporte enviado</h3>
                <p className="text-muted-foreground italic max-w-[280px] mx-auto text-sm">
                  Revisaremos el contenido en las próximas 24 horas. Gracias por cuidar nuestra comunidad.
                </p>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-accent text-white rounded-xl h-14 font-bold"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

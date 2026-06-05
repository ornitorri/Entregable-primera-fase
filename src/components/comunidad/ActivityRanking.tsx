'use client';

import React from 'react';
import Image from 'next/image';
import { Trophy, Crown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const RANKING_DATA = [
  { id: 1, name: 'Julian Vance', role: 'EMBAJADOR 👑', points: 1240, avatar: 'https://picsum.photos/seed/a1/100/100', medal: '🥇' },
  { id: 2, name: 'Elena Martínez', role: 'PREMIUM ⭐', points: 980, avatar: 'https://picsum.photos/seed/a2/100/100', medal: '🥈' },
  { id: 3, name: 'Carlos Ruiz', role: 'USUARIO', points: 750, avatar: 'https://picsum.photos/seed/a3/100/100', medal: '🥉' },
  { id: 4, name: 'Sofía Lectora', role: 'PREMIUM ⭐', points: 620, avatar: 'https://picsum.photos/seed/user1/100/100', medal: '4️⃣' },
  { id: 5, name: 'Diego Libros', role: 'USUARIO', points: 410, avatar: 'https://picsum.photos/seed/u3/100/100', medal: '5️⃣' },
];

export default function ActivityRanking() {
  const maxPoints = RANKING_DATA[0].points;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber" /> Top miembros del mes
        </h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted hover:text-amber transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-ink text-cream border-none p-3 rounded-xl max-w-[200px]">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-amber">Cálculo de puntos</p>
              <ul className="text-[9px] space-y-1 opacity-90 italic">
                <li>• Posts: 10pts</li>
                <li>• Reseñas: 25pts</li>
                <li>• Comentarios: 5pts</li>
                <li>• Likes: 1pt</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-6">
        {RANKING_DATA.map((member, i) => (
          <div key={member.id} className="group space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-lg z-10 drop-shadow-sm">{member.medal}</span>
                  <div className={cn(
                    "relative w-10 h-10 rounded-full p-0.5 border-2",
                    i === 0 ? "border-amber shadow-[0_0_10px_rgba(200,134,10,0.3)]" :
                    i === 1 ? "border-slate-300" :
                    i === 2 ? "border-amber/40" : "border-warm/60"
                  )}>
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-foreground group-hover:text-amber transition-colors line-clamp-1">{member.name}</h5>
                    {i === 0 && (
                      <Badge className="bg-amber text-cream border-none text-[8px] font-black h-4 px-1.5 shadow-lg shimmer-btn">
                        REY LECTOR 👑
                      </Badge>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-tighter opacity-70">{member.role}</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-foreground font-dmsans">{member.points.toLocaleString()} <span className="text-[8px] font-bold text-muted">PTS</span></span>
            </div>
            <div className="relative h-1.5 w-full bg-warm/30 rounded-full overflow-hidden">
              <Progress 
                value={(member.points / maxPoints) * 100} 
                className={cn(
                  "h-full transition-all duration-1000",
                  i === 0 ? "bg-amber" : "bg-foreground/40"
                )} 
              />
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full text-amber font-bold text-xs uppercase tracking-widest hover:bg-amber-pale py-6 rounded-2xl border-2 border-dashed border-warm/40 hover:border-amber/20">
        Ver ranking completo <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader, UserPlus } from 'lucide-react';

interface GroupJoinButtonProps {
  groupId: number;
  onSuccess?: () => void;
}

export default function GroupJoinButton({ groupId, onSuccess }: GroupJoinButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    checkMembership();
  }, [groupId]);

  const checkMembership = async () => {
    try {
      const response = await fetch(`/api/user/me`);
      if (response.ok) {
        const userData = await response.json();
        const userId = userData.id;

        // Verificar si es miembro del grupo
        const memberResponse = await fetch(`/api/groups/${groupId}`);
        if (memberResponse.ok) {
          const groupData = await memberResponse.json();
          const isMemberCheck = groupData.data?.members?.some((m: any) => m.user_id === userId);
          setIsMember(isMemberCheck || false);
        }
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  if (isMember) {
    return (
      <div className="text-center py-4 px-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          Ya eres miembro de este grupo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={async () => {
          setLoading(true);
          try {
            const response = await fetch(`/api/groups/${groupId}/join`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: '',
              }),
            });

            const data = await response.json();

            if (response.ok) {
              toast({
                title: 'Éxito',
                description: '¡Te has unido al grupo!',
              });
              setIsMember(true);
              onSuccess?.();
            } else {
              toast({
                title: 'Error',
                description: data.error || 'Error al unirse al grupo',
                variant: 'destructive',
              });
            }
          } catch (error) {
            console.error('Error joining group:', error);
            toast({
              title: 'Error',
              description: 'Error de conexión',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/80 text-white font-black uppercase tracking-widest"
      >
        {loading && <Loader className="animate-spin mr-2 w-4 h-4" />}
        Unirme al grupo
      </Button>
    </div>
  );
}

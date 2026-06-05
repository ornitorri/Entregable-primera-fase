import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ban, Undo2, Mail, Shield, Eye, Trash2 } from 'lucide-react';

interface User {
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

interface UserManagementProps {
  users: User[];
  onBanUser: (userId: number, reason: string) => Promise<void>;
  onUnbanUser: (userId: number) => Promise<void>;
  loading?: boolean;
}

const roleLabels = {
  user: { label: 'Usuario', color: 'bg-blue-500/20 text-blue-400' },
  admin: { label: 'Administrador', color: 'bg-red-500/20 text-red-400' },
  logistics: { label: 'Logística', color: 'bg-yellow-500/20 text-yellow-400' },
  marketing: { label: 'Marketing', color: 'bg-green-500/20 text-green-400' },
  publicity: { label: 'Publicidad', color: 'bg-purple-500/20 text-purple-400' },
};

export default function UserManagement({ users, onBanUser, onUnbanUser, loading }: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [showBanDialog, setShowBanDialog] = useState(false);

  const bannedUsers = users.filter(u => u.is_banned);
  const activeUsers = users.filter(u => !u.is_banned);

  const handleBanClick = (user: User) => {
    setSelectedUser(user);
    setShowBanDialog(true);
    setBanReason('');
  };

  const handleConfirmBan = async () => {
    if (selectedUser) {
      await onBanUser(selectedUser.id, banReason || 'Violación de términos de servicio');
      setShowBanDialog(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-10">
      {/* Resumen de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 p-8 rounded-[2rem]">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total de Usuarios</p>
            <p className="text-4xl font-black text-white">{users.length}</p>
          </div>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20 p-8 rounded-[2rem]">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Usuarios Activos</p>
            <p className="text-4xl font-black text-emerald-400">{activeUsers.length}</p>
          </div>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20 p-8 rounded-[2rem]">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Usuarios Baneados</p>
            <p className="text-4xl font-black text-red-400">{bannedUsers.length}</p>
          </div>
        </Card>
      </div>

      {/* Tabla de usuarios activos */}
      <div className="space-y-6">
        <h3 className="text-3xl font-playfair font-black text-white border-b border-white/5 pb-6">Usuarios Registrados</h3>
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">
                  <th className="px-8 py-6 text-left">Usuario</th>
                  <th className="px-8 py-6 text-left">Email</th>
                  <th className="px-8 py-6 text-left">Rol</th>
                  <th className="px-8 py-6 text-left">Fecha Registro</th>
                  <th className="px-8 py-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeUsers.length > 0 ? activeUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {user.avatar_url && (
                          <img 
                            src={user.avatar_url} 
                            alt={user.first_name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                        )}
                        <div>
                          <p className="text-base font-bold text-white">{user.first_name} {user.last_name}</p>
                          <p className="text-[10px] text-white/40">@{user.alias}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white/60">{user.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={`${roleLabels[user.role].color} border-none text-[9px] font-black`}>
                        {roleLabels[user.role].label}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-white/40">{formatDate(user.created_at)}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white/40 hover:text-red-500 rounded-xl"
                          onClick={() => handleBanClick(user)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-white/40">
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios baneados */}
      {bannedUsers.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-3xl font-playfair font-black text-red-400 border-b border-red-500/20 pb-6">Usuarios Baneados</h3>
          <div className="bg-red-500/[0.02] border border-red-500/20 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-500/10 border-b border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-300">
                    <th className="px-8 py-6 text-left">Usuario</th>
                    <th className="px-8 py-6 text-left">Razón del Ban</th>
                    <th className="px-8 py-6 text-left">Fecha</th>
                    <th className="px-8 py-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-500/10">
                  {bannedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-base font-bold text-white">{user.first_name} {user.last_name}</p>
                        <p className="text-[10px] text-white/40">@{user.alias}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-red-300">{user.ban_reason}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-white/40">{user.ban_reason ? 'Baneado' : '-'}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white/40 hover:text-emerald-400 rounded-xl"
                          onClick={() => onUnbanUser(user.id)}
                        >
                          <Undo2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para banear usuario */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent className="bg-[#0a0a0c] border-red-500/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-playfair text-red-400">
              Banear Usuario
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              {selectedUser ? `¿Estás seguro de que deseas banear a ${selectedUser.first_name} ${selectedUser.last_name}?` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-red-400">
                Razón del Ban
              </Label>
              <textarea 
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Especifica el motivo del ban..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 text-sm"
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <AlertDialogCancel className="rounded-xl border-white/10 text-white hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBan}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Ban'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface CreateGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TOPICS = [
  'Ciencia Ficción',
  'Romance',
  'Misterio',
  'Fantasía',
  'Suspenso',
  'Realismo Mágico',
  'Poesía',
  'Clásicos',
  'Desarrollo Personal',
  'Historia'
];

export default function CreateGroupForm({ isOpen, onClose, onSuccess }: CreateGroupFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
    cover_image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.topic.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre y tema son obligatorios',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Grupo creado exitosamente'
        });
        setFormData({ name: '', description: '', topic: '', cover_image: '' });
        onClose();
        onSuccess?.();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al crear el grupo',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Grupo</DialogTitle>
          <DialogDescription>
            Crea un grupo literario para conectar con otros lectores
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Grupo *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Amantes del Realismo Mágico"
              maxLength={150}
              className="text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema *
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Selecciona un tema</option>
              {TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu grupo (qué discutirán, objetivos, etc.)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen de Portada
            </label>
            <Input
              type="url"
              name="cover_image"
              value={formData.cover_image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader className="animate-spin mr-2" size={18} />}
              Crear Grupo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

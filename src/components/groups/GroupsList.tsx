'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Plus, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Group {
  id: number;
  name: string;
  description: string;
  topic: string;
  cover_image?: string;
  creator_alias: string;
  member_count: number;
  created_at: string;
}

interface GroupsListProps {
  onCreateClick?: () => void;
  userRole?: string;
  userPlan?: string;
}

export default function GroupsList({ onCreateClick, userRole = 'user', userPlan = 'free' }: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const canCreateGroup = userRole === 'admin' || userPlan === 'embajador';

  const topics = [
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

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [groups, searchTerm, selectedTopic]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = groups;

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTopic) {
      filtered = filtered.filter(group => group.topic === selectedTopic);
    }

    setFilteredGroups(filtered);
  };

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">📚 Grupos Literarios</h2>
            <p className="text-gray-600 mt-1">Únete a comunidades de lectores apasionados</p>
          </div>
          {canCreateGroup && (
            <Button
              onClick={onCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus size={18} />
              Crear Grupo
            </Button>
          )}
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Filtros por Tema */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedTopic === null ? 'default' : 'outline'}
          onClick={() => setSelectedTopic(null)}
          size="sm"
        >
          Todos
        </Button>
        {topics.map(topic => (
          <Button
            key={topic}
            variant={selectedTopic === topic ? 'default' : 'outline'}
            onClick={() => setSelectedTopic(topic)}
            size="sm"
          >
            {topic}
          </Button>
        ))}
      </div>

      {/* Lista de Grupos */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : filteredGroups.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No se encontraron grupos</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map(group => (
            <Link key={group.id} href={`/grupos/${group.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {group.cover_image && (
                  <div className="relative w-full h-40 bg-gray-200">
                    <Image
                      src={group.cover_image}
                      alt={group.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                        {group.name}
                      </h3>
                      <Badge className="mt-2">{group.topic}</Badge>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {group.description || 'Sin descripción'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users size={16} />
                        <span>{group.member_count} miembros</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        Por: {group.creator_alias}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

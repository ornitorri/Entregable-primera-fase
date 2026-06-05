'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Info, 
  Smile, 
  Image as ImageIcon,
  MoreHorizontal,
  Lock,
  Globe,
  Activity,
  Heart,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import ActivityRanking from '@/components/comunidad/ActivityRanking';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  user: string;
  avatar: string;
  role: string;
  content: string;
  time: string;
  image?: string;
  reactions: { emoji: string; count: number }[];
  commentsCount: number;
}

const INITIAL_POSTS: Post[] = [
  { 
    id: '1', 
    user: 'Elena Martínez', 
    avatar: 'https://picsum.photos/seed/u1/100/100', 
    role: 'PREMIUM ⭐',
    content: '¿Alguien ha empezado ya el libro del mes? Me parece que el primer capítulo es una obra de arte en sí mismo.', 
    time: 'hace 10 min',
    reactions: [{ emoji: '❤️', count: 12 }, { emoji: '👏', count: 5 }],
    commentsCount: 3
  },
  { 
    id: '2', 
    user: 'Julian Vance', 
    avatar: 'https://picsum.photos/seed/u2/100/100', 
    role: 'EMBAJADOR 👑',
    content: '¡Sí! Voy por el capítulo 3. Me está encantando la prosa. La forma en que describe el paisaje es increíble.', 
    time: 'hace 1 hora',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
    reactions: [{ emoji: '🔥', count: 24 }, { emoji: '❤️', count: 18 }],
    commentsCount: 8
  },
];

const GROUP_DATA = {
  id: '1',
  name: "Clásicos Eternos",
  description: "Dedicado al estudio y apreciación de las obras maestras de la literatura universal. Desde Homero hasta Saramago.",
  banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
  members: "1.2k",
  online: "48",
  type: "Público"
};

export default function GrupoPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cachedPosts = localStorage.getItem(`readzzi_group_${groupId}_posts`);
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem(`readzzi_group_${groupId}_posts`, JSON.stringify(INITIAL_POSTS));
    }
  }, [groupId]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(`readzzi_group_${groupId}_posts`, JSON.stringify(posts));
    }
  }, [posts, mounted, groupId]);

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      user: "Tú",
      avatar: 'https://picsum.photos/seed/user1/100/100',
      role: 'PREMIUM ⭐',
      content: newPostText,
      time: 'Ahora mismo',
      reactions: [],
      commentsCount: 0
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 2);
      setIsLoadingMore(false);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background pt-[72px]">
      <Navigation activeTab="comunidad" />

      {/* Hero del Grupo */}
      <section className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
        <Image src={GROUP_DATA.banner} alt={GROUP_DATA.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-8 md:pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-accent text-white border-none font-bold px-3 py-1">
                  {GROUP_DATA.type === 'Público' ? <Globe className="w-3 h-3 mr-1.5" /> : <Lock className="w-3 h-3 mr-1.5" />}
                  {GROUP_DATA.type}
                </Badge>
                <span className="text-white/80 text-xs font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {GROUP_DATA.members} miembros
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-black text-white leading-none tracking-tighter">
                {GROUP_DATA.name}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button className="bg-accent hover:bg-white hover:text-accent text-white rounded-full px-8 h-12 font-bold shadow-2xl transition-all">
                Unido
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="feed" className="w-full">
        {/* Barra de Navegación Secundaria - FIJA Y OPACA */}
        <div className="bg-[#0a0a0c] border-b border-white/10 sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto px-6">
            <TabsList className="bg-transparent p-0 gap-8 h-16 w-full justify-start overflow-x-auto no-scrollbar">
              {[
                { id: 'feed', label: 'Conversación', icon: Activity },
                { id: 'miembros', label: 'Miembros', icon: Users },
                { id: 'eventos', label: 'Eventos', icon: Calendar },
                { id: 'sobre', label: 'Sobre el grupo', icon: Info },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="bg-transparent p-0 h-full text-[10px] font-black uppercase tracking-[0.2em] rounded-none data-[state=active]:bg-transparent data-[state=active]:text-accent border-b-2 border-transparent data-[state=active]:border-accent shadow-none transition-all flex items-center gap-2 text-white/40"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-8">
              <TabsContent value="feed" className="m-0 space-y-8 animate-in fade-in duration-500">
                <Card className="border-white/5 bg-white/[0.03] rounded-[2rem] p-6 shadow-sm">
                  <div className="flex gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                      <Image src="https://picsum.photos/seed/user1/100/100" alt="Tú" fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <Input 
                        placeholder="Escribe algo al muro del grupo..." 
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        className="h-12 bg-white/5 border-none rounded-xl focus-visible:ring-accent/30 text-white text-sm px-4"
                      />
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="rounded-full text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-white/5 text-white/40">
                            <ImageIcon className="w-3.5 h-3.5" /> Foto
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-white/5 text-white/40">
                            <BookOpen className="w-3.5 h-3.5" /> Libro
                          </Button>
                        </div>
                        <Button 
                          onClick={handleCreatePost}
                          disabled={!newPostText.trim()}
                          className="bg-accent hover:bg-white hover:text-accent text-white rounded-full px-6 h-9 font-black uppercase tracking-widest text-[9px] shadow-lg disabled:opacity-50 transition-all"
                        >
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  {posts.slice(0, visibleCount).map((post) => (
                    <Card key={post.id} className="border-white/5 bg-white/[0.03] rounded-[2rem] shadow-sm overflow-hidden hover:bg-white/[0.05] transition-all">
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                              <Image src={post.avatar} alt={post.user} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-playfair font-bold text-white text-base leading-none">{post.user}</h4>
                                <Badge className="bg-accent/10 text-accent border-none text-[7px] font-black px-1.5 py-0.5 uppercase tracking-widest">{post.role}</Badge>
                              </div>
                              <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">{post.time}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white/30"><MoreHorizontal className="w-4 h-4" /></Button>
                        </div>

                        <p className="text-white/70 leading-relaxed text-sm italic font-light whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {post.image && (
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image src={post.image} alt="Contenido" fill className="object-cover" />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-white/30 hover:text-accent transition-colors group">
                              <Heart className="w-4 h-4 group-active:scale-125 transition-transform" />
                              <span className="text-[10px] font-bold">Me gusta</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/30 hover:text-white transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-[10px] font-bold">{post.commentsCount} comentarios</span>
                            </button>
                          </div>
                          <button className="flex items-center gap-2 text-white/30 hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Compartir</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {visibleCount < posts.length && (
                  <div className="py-10 flex flex-col items-center gap-4">
                    <Button 
                      variant="ghost" 
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="text-accent font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/10 px-8 h-12 rounded-xl border-2 border-dashed border-accent/20 transition-all"
                    >
                      {isLoadingMore ? 'Conectando...' : 'Ver más publicaciones'}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="miembros" className="m-0"><div className="py-20 text-center text-white/20 italic bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">Próximamente...</div></TabsContent>
              <TabsContent value="eventos" className="m-0"><div className="py-20 text-center text-white/20 italic bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">Próximamente...</div></TabsContent>
              <TabsContent value="sobre" className="m-0"><div className="py-20 text-center text-white/20 italic bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">Próximamente...</div></TabsContent>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">
                <Card className="rounded-[2rem] p-6 border-white/5 bg-white/[0.03] shadow-sm">
                  <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Información</h4>
                  <div className="space-y-4">
                    <p className="text-xs text-white/50 leading-relaxed italic">{GROUP_DATA.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-white/70">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-bold">{GROUP_DATA.members} miembros registrados</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/70">
                        <Activity className="w-4 h-4 text-sage" />
                        <span className="text-[10px] font-bold">Muy activo hoy</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[2rem] p-6 border-white/5 bg-white/[0.03] shadow-sm">
                  <ActivityRanking />
                </Card>

                <Card className="rounded-[2rem] p-6 border-white/5 bg-white/[0.03] shadow-sm">
                  <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-accent" /> Tendencias
                  </h4>
                  <div className="space-y-4">
                    {['#LecturaColectiva', '#Saramago90', '#ClasicosRusia'].map((tag, i) => (
                      <div key={i} className="group cursor-pointer flex items-center justify-between">
                        <span className="text-xs font-bold text-white/50 group-hover:text-accent transition-colors">{tag}</span>
                        <span className="text-[9px] font-black text-white/10 uppercase">+{i * 12}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </Tabs>
    </main>
  );
}
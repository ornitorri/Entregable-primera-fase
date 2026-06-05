
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Users, 
  Bookmark, 
  Bell, 
  BarChart3, 
  Image as ImageIcon, 
  BookOpen, 
  Smile, 
  MessageSquare, 
  MoreHorizontal,
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  Flag,
  Home,
  User as UserIcon,
  Heart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import ReportModal from '@/components/comunidad/ReportModal';
import NotificationPanel from '@/components/NotificationPanel';
import PostInteractions from '@/components/community/PostInteractions';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface Post {
  id: string | number;
  userId: number;
  user: string;
  role: string;
  avatar: string;
  content: string;
  time: string;
  image?: string;
  bookMention?: {
    id: string;
    title: string;
    author: string;
    price: string;
    img: string;
  };
  reactions: { emoji: string; count: number }[];
  commentCount: number;
  hasReacted: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: "Elena Martínez",
    role: "PREMIUM",
    avatar: "https://picsum.photos/seed/user2/100/100",
    content: "Finalmente he terminado de leer @CienAñosDeSoledad. Es increíble cómo Gabo logra transportarte a Macondo. ¡Totalmente recomendado! #RealismoMagico",
    time: "hace 2 horas",
    bookMention: {
      id: '1',
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      price: '$85.000',
      img: 'https://picsum.photos/seed/catalog1/200/300'
    },
    reactions: [
      { emoji: "📖", count: 24 },
      { emoji: "❤️", count: 18 },
      { emoji: "👏", count: 31 }
    ]
  },
  {
    id: '2',
    user: "Julian Vance",
    role: "EMBAJADOR",
    avatar: "https://picsum.photos/seed/user3/100/100",
    content: "Mi pequeño rincón de paz hoy. ¿Cuál es su lugar favorito para leer? ☕📖",
    time: "hace 5 horas",
    image: "https://picsum.photos/seed/postimg/800/450",
    reactions: [
      { emoji: "❤️", count: 120 },
      { emoji: "🤩", count: 45 }
    ]
  }
];

const USER_MOCK_DEFAULT = {
  name: "Usuario",
  role: "MIEMBRO",
  avatar: "https://picsum.photos/seed/user1/100/100"
};

const RECENT_GROUPS = [
  { id: 1, name: "Clásicos Eternos", img: "https://picsum.photos/seed/g1/60/60", hasActivity: true },
  { id: 2, name: "Fantasía Juvenil", img: "https://picsum.photos/seed/g2/60/60", hasActivity: false },
  { id: 3, name: "Misterio Bogotá", img: "https://picsum.photos/seed/g3/60/60", hasActivity: true },
];

const TRENDS = [
  { tag: "#LecturaDelMes", posts: 234 },
  { tag: "#GaboVive", posts: 189 },
  { tag: "#NovedadesAbril", posts: 156 },
  { tag: "#PoesiaColombiana", posts: 120 },
  { tag: "#LibrosRecomendados", posts: 98 },
];

export default function ComunidadPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(USER_MOCK_DEFAULT);
  const [activeTab, setActiveTab] = useState('para-ti');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    setToken(authToken);
    setIsAuthenticated(Boolean(authToken));
    
    // Cargar información del usuario autenticado
    const userInfoString = localStorage.getItem('user_info');
    if (userInfoString) {
      try {
        const parsedUser = JSON.parse(userInfoString);
        setUserInfo({
          name: `${parsedUser.first_name || ''} ${parsedUser.last_name || ''}`.trim() || 'Usuario',
          role: parsedUser.role === 'user' ? 'MIEMBRO' : parsedUser.role?.toUpperCase() || 'MIEMBRO',
          avatar: parsedUser.avatar_url || `https://picsum.photos/seed/user-${parsedUser.id || '1'}/100/100`
        });
      } catch (e) {
        setUserInfo(USER_MOCK_DEFAULT);
      }
    }
    
    loadPosts(authToken);
  }, []);

  const loadPosts = async (authToken?: string) => {
    try {
      const response = await fetch('/api/community/posts', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
      });
      if (!response.ok) throw new Error('No se pudieron cargar publicaciones');
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setPosts(INITIAL_POSTS.map((p) => ({ ...p, commentCount: 0, hasReacted: false, userId: 0 })));
        return;
      }
      const mapped: Post[] = data.map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        user: `${p.first_name} ${p.last_name}`,
        role: 'LECTOR',
        avatar: p.avatar_url || `https://picsum.photos/seed/user-${p.user_id}/100/100`,
        content: p.content,
        time: new Date(p.created_at).toLocaleString('es-CO'),
        image: p.image_url || undefined,
        bookMention: p.book_mention_id ? {
          id: p.book_mention_id,
          title: p.book_title,
          author: p.book_author,
          price: p.book_price,
          img: p.book_cover
        } : undefined,
        reactions: p.reactions || [],
        commentCount: p.commentCount || 0,
        hasReacted: Boolean(p.hasReacted)
      }));
      setPosts(mapped);
    } catch {
      setPosts(INITIAL_POSTS.map((p) => ({ ...p, commentCount: 0, hasReacted: false, userId: 0 })));
    }
  };

  const handlePublish = async () => {
    if (!newPostText.trim() && !selectedImage) return;
    if (!token) return;

    try {
      let imageBase64 = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
      }

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostText,
          imageUrl: null,
          imageBase64: imageBase64,
          bookMentionId: null,
          communityId: null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al publicar');
        return;
      }

      const newPost = await response.json();
      
      const mappedPost: Post = {
        id: newPost.id,
        userId: newPost.user_id,
        user: `${newPost.first_name} ${newPost.last_name}`,
        role: 'LECTOR',
        avatar: newPost.avatar_url || `https://picsum.photos/seed/user-${newPost.user_id}/100/100`,
        content: newPost.content,
        time: 'Ahora mismo',
        image: newPost.image_url || imageBase64 || undefined,
        bookMention: newPost.book_mention_id ? {
          id: newPost.book_mention_id,
          title: newPost.book_title,
          author: newPost.book_author,
          price: newPost.book_price,
          img: newPost.book_cover
        } : undefined,
        reactions: [],
        commentCount: 0,
        hasReacted: false
      };

      setPosts([mappedPost, ...posts]);
      setNewPostText('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Error al publicar el post');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReaction = async (postId: string | number, emoji: string) => {
    if (!token) return;
    const response = await fetch('/api/community/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ postId, emoji })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'No se pudo registrar la reacción');
    }
    await loadPosts(token);
  };

  const handleComment = async (postId: string | number, content: string) => {
    if (!token) return;
    await fetch('/api/community/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ postId, content })
    });
    await loadPosts(token);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-transparent pt-[72px] pb-24 md:pb-10">
      <Navigation activeTab="comunidad" />

      {/* Main Grid Container - Full Width Adaptive */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] lg:grid-cols-[280px_1fr_300px] gap-6 lg:gap-10 items-start">
          
          {/* LEFT SIDEBAR: Fully Functional */}
          <aside className="hidden md:block sticky top-[92px] h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 lg:p-8 flex flex-col items-center h-full shadow-2xl">
              
              {/* User Identity - Detailed on Desktop */}
              <Link href="/perfil" className="hidden lg:flex flex-col items-center text-center space-y-4 w-full mb-8 group">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent/20 p-1 group-hover:border-accent transition-all">
                  <Image src={userInfo.avatar} alt={userInfo.name} fill className="object-cover rounded-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-playfair font-black text-white group-hover:text-accent transition-colors">{userInfo.name}</h3>
                  <Badge className="bg-accent/10 text-accent border-none text-[8px] font-black uppercase tracking-widest">{userInfo.role}</Badge>
                </div>
              </Link>

              {/* Navigation Links - Now Functional */}
              <nav className="w-full space-y-2">
                {[
                  { icon: Globe, label: "Feed global", active: true, href: '/comunidad' },
                  { icon: Users, label: "Mis grupos", badge: "3", href: '/comunidad/clubes' },
                  { icon: Bookmark, label: "Guardados", href: '/perfil' },
                  { icon: Bell, label: "Avisos", badge: "5", isNotif: true },
                  { icon: BarChart3, label: "Estadísticas", href: '/logros' }
                ].map((item, i) => (
                  item.isNotif ? (
                    <NotificationPanel key={i}>
                      <button className="w-full flex items-center justify-center lg:justify-between px-4 py-4 rounded-2xl transition-all group text-white/40 hover:text-white hover:bg-white/5">
                        <div className="flex items-center gap-4">
                          <item.icon className="w-5 h-5" />
                          <span className="hidden lg:inline text-sm font-bold">{item.label}</span>
                        </div>
                        {item.badge && <span className="hidden lg:flex bg-rust text-white text-[9px] font-black w-5 h-5 rounded-full items-center justify-center">{item.badge}</span>}
                      </button>
                    </NotificationPanel>
                  ) : (
                    <Link href={item.href || '#'} key={i}>
                      <button className={cn(
                        "w-full flex items-center justify-center lg:justify-between px-4 py-4 rounded-2xl transition-all group",
                        item.active ? "bg-accent/20 text-accent border border-accent/20" : "text-white/40 hover:text-white hover:bg-white/5"
                      )}>
                        <div className="flex items-center gap-4">
                          <item.icon className="w-5 h-5" />
                          <span className="hidden lg:inline text-sm font-bold">{item.label}</span>
                        </div>
                        {item.badge && <span className="hidden lg:flex bg-rust text-white text-[9px] font-black w-5 h-5 rounded-full items-center justify-center">{item.badge}</span>}
                      </button>
                    </Link>
                  )
                ))}
              </nav>

              {/* Groups Links */}
              <div className="hidden lg:block w-full mt-8 pt-8 border-t border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Grupos recientes</h4>
                <div className="space-y-4 px-2">
                  {RECENT_GROUPS.map((group) => (
                    <Link href={`/comunidad/${group.id}`} key={group.id} className="flex items-center gap-3 group">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                        <Image src={group.img} alt={group.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-white/60 group-hover:text-accent truncate">{group.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CENTRAL FEED: Main Content Area */}
          <section className="space-y-8">
            {/* Header Tabs - Rock Solid Sticky */}
            <div className="sticky top-[72px] z-40 bg-[#0a0a0c] md:bg-[#0a0a0c] py-4 -mx-4 px-4 md:mx-0 md:rounded-b-3xl shadow-2xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-white/5 border border-white/10 rounded-2xl p-1 h-12 md:h-14">
                  {['Para ti', 'Recientes', 'Tendencias'].map((tab) => (
                    <TabsTrigger 
                      key={tab}
                      value={tab.toLowerCase().replace(' ', '-')}
                      className="flex-1 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-white transition-all"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Post Creator */}
                <div className="mt-8">
                  <Card className="border-white/10 bg-white/[0.03] rounded-[2.5rem] p-6 md:p-10 shadow-xl">
                    <div className="flex gap-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 hidden sm:block">
                        <Image src={userInfo.avatar} alt={userInfo.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <Input 
                          placeholder="¿Qué estás leyendo hoy?" 
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          className="h-14 md:h-16 bg-white/5 border-none rounded-2xl focus-visible:ring-accent/30 text-base px-6 shadow-inner"
                        />
                        {imagePreview && (
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover rounded-lg border border-accent/30"
                            />
                            <button
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest gap-2 text-sage hover:bg-sage/10 transition-colors"
                            >
                              <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Foto</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest gap-2 text-accent hover:bg-accent/10 transition-colors">
                              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Mencionar Libro</span>
                            </Button>
                          </div>
                          <Button 
                            onClick={handlePublish}
                            disabled={(!newPostText.trim() && !selectedImage) || !isAuthenticated}
                            className="bg-accent hover:bg-white hover:text-accent text-white rounded-full px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-accent/20 disabled:opacity-30 transition-all active:scale-95"
                          >
                            Publicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Tabs Content */}
                <div className="mt-8">
                  {/* Para Ti Tab */}
                  <TabsContent value="para-ti" className="space-y-8 pb-20 m-0">
                    {posts.map((post) => (
                      <Card key={post.id} className="border-white/5 bg-white/[0.03] rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] transition-all duration-500 shadow-lg">
                        <CardHeader className="p-8 md:p-12 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-5">
                              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 p-1">
                                <Image src={post.avatar} alt="User" fill className="object-cover rounded-full" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <h4 className="font-playfair font-black text-white text-xl">{post.user}</h4>
                                  <Badge className="w-fit bg-accent text-white border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">
                                    {post.role}
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Plus className="w-3 h-3 text-accent" /> {post.time}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-white/20 hover:text-white transition-colors">
                              <MoreHorizontal className="w-6 h-6" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 pt-0 space-y-8">
                          <p className="text-white/80 leading-relaxed text-base md:text-lg italic font-light whitespace-pre-wrap italic">
                            "{post.content}"
                          </p>
                          
                          {post.image && (
                            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                              <Image src={post.image} alt="Content" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                          )}

                          {post.bookMention && (
                            <Link href={`/catalogo/${post.bookMention.id}`}>
                              <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-6 md:p-10 flex gap-6 md:gap-12 hover:bg-white/10 transition-all group/book shadow-xl">
                                <div className="relative w-20 md:w-32 h-32 md:h-48 rounded-2xl overflow-hidden shadow-2xl shrink-0 group-hover/book:scale-105 transition-transform">
                                  <Image src={post.bookMention.img} alt="Book" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col justify-center space-y-2 md:space-y-5">
                                  <h5 className="font-playfair font-black text-white text-xl md:text-4xl leading-tight line-clamp-2">{post.bookMention.title}</h5>
                                  <p className="text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-widest italic">{post.bookMention.author}</p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-accent font-black text-2xl md:text-4xl tracking-tighter">{post.bookMention.price}</span>
                                    <Button size="sm" className="bg-white/10 hover:bg-accent text-white rounded-full px-6 font-bold text-[10px] uppercase">Ver Detalles</Button>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )}

                          <PostInteractions
                            postId={String(post.id)}
                            reactions={post.reactions}
                            commentCount={post.commentCount}
                            canReact={!post.hasReacted}
                            isAuthenticated={isAuthenticated}
                            onReact={(emoji) => handleReaction(post.id, emoji)}
                            onComment={(content) => handleComment(post.id, content)}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Recientes Tab */}
                  <TabsContent value="recientes" className="space-y-8 pb-20 m-0">
                    <Card className="border-white/10 bg-white/[0.03] rounded-[2.5rem] p-8 md:p-12 text-center">
                      <div className="space-y-4">
                        <Bell className="w-16 h-16 mx-auto text-accent/30" />
                        <h3 className="text-2xl font-playfair font-black text-white">Publicaciones Recientes</h3>
                        <p className="text-white/40 text-sm max-w-md mx-auto">
                          Aquí aparecerán los posts más recientes de la comunidad. Esta sección se habilitará próximamente con nuevas funcionalidades.
                        </p>
                      </div>
                    </Card>
                    {posts.slice(0, 3).map((post) => (
                      <Card key={post.id} className="border-white/5 bg-white/[0.03] rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] transition-all duration-500 shadow-lg">
                        <CardHeader className="p-8 md:p-12 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-5">
                              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 p-1">
                                <Image src={post.avatar} alt="User" fill className="object-cover rounded-full" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <h4 className="font-playfair font-black text-white text-xl">{post.user}</h4>
                                  <Badge className="w-fit bg-accent text-white border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">
                                    {post.role}
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Plus className="w-3 h-3 text-accent" /> {post.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 pt-0 space-y-8">
                          <p className="text-white/80 leading-relaxed text-base md:text-lg italic font-light whitespace-pre-wrap italic">
                            "{post.content}"
                          </p>
                          {post.image && (
                            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                              <Image src={post.image} alt="Content" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Tendencias Tab */}
                  <TabsContent value="tendencias" className="space-y-8 pb-20 m-0">
                    <Card className="border-white/10 bg-white/[0.03] rounded-[2.5rem] p-8 md:p-12">
                      <h3 className="text-2xl font-playfair font-black text-white mb-8 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-accent" />
                        Tendencias de Hoy
                      </h3>
                      <div className="space-y-6">
                        {TRENDS.map((trend, i) => (
                          <div key={i} className="group cursor-pointer border-l-4 border-accent/20 hover:border-accent pl-6 py-2 transition-all">
                            <p className="text-lg font-bold text-white group-hover:text-accent transition-colors">{trend.tag}</p>
                            <span className="text-sm text-white/40 font-bold uppercase tracking-widest">{trend.posts} publicaciones en tendencia</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </section>

          {/* RIGHT SIDEBAR: Trends & Suggestions */}
          <aside className="hidden lg:block sticky top-[92px] space-y-10">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent" /> Tendencias
              </h4>
              <div className="space-y-8">
                {TRENDS.map((trend, i) => (
                  <div key={i} className="group cursor-pointer border-l-2 border-white/5 hover:border-accent pl-8 py-1 transition-all">
                    <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{trend.tag}</p>
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{trend.posts} publicaciones</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-white/10 bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10">Lectores Afines</h4>
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-xl">
                      <Image src={`https://picsum.photos/seed/s${i}/100/100`} alt="User" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">Lector Aventurero {i}</p>
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-wider">Interés: Realismo Mágico</span>
                    </div>
                    <Button size="icon" variant="ghost" className="text-accent hover:bg-accent/10 p-2 rounded-xl active:scale-90 transition-all">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-10 rounded-2xl border-white/10 text-white/40 hover:text-white hover:border-accent font-black uppercase text-[9px] tracking-widest h-12">
                Descubrir más
              </Button>
            </Card>
          </aside>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-3xl border-t border-white/10 px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {[
          { icon: Home, active: true, href: '/' },
          { icon: Users, href: '/comunidad/clubes' },
          { icon: Plus, isAction: true },
          { icon: Bell, href: '/noticias' },
          { icon: UserIcon, href: '/perfil' }
        ].map((item, i) => (
          item.isAction ? (
            <button key={i} className="bg-accent text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30 -mt-10 border-4 border-black active:scale-90 transition-all">
              <item.icon className="w-7 h-7" />
            </button>
          ) : (
            <Link key={i} href={item.href || '#'}>
              <button className={cn(
                "flex flex-col items-center gap-1 transition-all active:scale-110",
                item.active ? "text-accent" : "text-white/40"
              )}>
                <item.icon className="w-6 h-6" />
              </button>
            </Link>
          )
        ))}
      </nav>
    </main>
  );
}

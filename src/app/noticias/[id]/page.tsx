
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  Clock,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('es-CO', options).replace(/\./g, '');
};

const calculateReadTime = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min lectura`;
};

const mapCategoryToLabel = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'giras': 'Gira',
    'ferias': 'Feria',
    'lanzamientos': 'Lanzamiento',
    'entrevistas': 'Entrevista',
    'noticias': 'Noticia'
  };
  return categoryMap[category] || category;
};

export default function NoticiaDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const newsItem = await response.json();
        
        setNews({
          ...newsItem,
          typeLabel: mapCategoryToLabel(newsItem.category),
          date: formatDate(newsItem.published_at),
          image: newsItem.image_url || 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?q=80&w=2000&auto=format&fit=crop',
          author: `${newsItem.first_name || ''} ${newsItem.last_name || ''}`.trim() || 'Redacción READZZI',
          readTime: calculateReadTime(newsItem.content),
          excerpt: newsItem.summary || newsItem.content.substring(0, 150) + '...'
        });
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Error al cargar la noticia');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-nav">
        <Navigation activeTab="noticias" />
        <div className="h-[60vh] md:h-[70vh] w-full bg-gradient-to-b from-white/5 to-transparent animate-pulse" />
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="h-12 bg-white/10 rounded-lg w-1/3 mb-8 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-white/10 rounded-lg w-full animate-pulse" />
            <div className="h-6 bg-white/10 rounded-lg w-4/5 animate-pulse" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="min-h-screen bg-background pt-nav flex flex-col">
        <Navigation activeTab="noticias" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-playfair font-black text-white">{error || 'Noticia no encontrada'}</h1>
            <Link href="/noticias" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors font-black text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver al Magazine
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-nav">
      <Navigation activeTab="noticias" />

      {/* HERO SECTION DE LA NOTICIA */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image 
          src={news.image} 
          alt={news.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-12 md:pb-20 space-y-6">
          <Link href="/noticias" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors font-black text-xs uppercase tracking-widest mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver al Magazine
          </Link>
          <div className="space-y-4">
            <Badge className="bg-accent text-white border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              {news.typeLabel}
            </Badge>
            <h1 className="text-4xl md:text-7xl font-playfair font-black text-white leading-[1.1] tracking-tighter">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] md:text-xs font-black text-white uppercase tracking-widest pt-4">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> {news.date}</span>
              {news.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> {news.location}</span>}
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> {news.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO DE LA NOTICIA */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Columna de Texto Principal */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center gap-4 border-b border-white/10 pb-8">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                {news.author[0]}
              </div>
              <div>
                <p className="text-xs font-black text-white/40 uppercase tracking-widest">Escrito por</p>
                <p className="text-sm font-bold text-white">{news.author}</p>
              </div>
            </div>

            <article className="prose prose-invert max-w-none">
              <p className="text-2xl text-white/90 font-light italic leading-relaxed mb-10 border-l-4 border-accent pl-8">
                {news.excerpt}
              </p>
              
              <div className="text-lg text-white/80 font-body leading-relaxed space-y-8 whitespace-pre-wrap italic">
                {news.content}
              </div>
            </article>

            {/* Tags y Compartir al final */}
            <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-wrap gap-2">
                {['Literatura', 'Colombia', 'Cultura', 'Gabo'].map(tag => (
                  <Badge key={tag} variant="outline" className="border-white/20 text-white/60 font-bold uppercase text-[9px] px-3 py-1">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compartir nota:</span>
                <div className="flex gap-2">
                  {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                    <Button key={i} variant="ghost" size="icon" className="text-white/60 hover:text-accent rounded-full border border-white/10">
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar de la Noticia */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-12">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Acciones rápidas</h4>
                <div className="space-y-4">
                  <Button className="w-full bg-accent hover:bg-white hover:text-accent text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] gap-3 border-none">
                    <Bookmark className="w-5 h-5" /> Guardar para después
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] gap-3">
                    <Share2 className="w-5 h-5" /> Enviar a un amigo
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-accent" /> Comentarios
                </h4>
                <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-xs text-white/40 italic">Sé el primero en comentar esta nota.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

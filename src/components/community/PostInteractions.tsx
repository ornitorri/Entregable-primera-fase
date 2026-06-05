'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, MoreHorizontal, Send, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface Comment {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  content: string;
  created_at: string;
}

interface PostInteractionsProps {
  postId: string;
  reactions: { emoji: string; count: number }[];
  commentCount: number;
  onReact: (emoji: string) => Promise<void>;
  onComment: (content: string) => Promise<void>;
  canReact?: boolean;
  isAuthenticated?: boolean;
}

const EMOJI_REACTIONS = ['❤️', '👏', '🔥', '😍', '💯', '📖'];

export default function PostInteractions({
  postId,
  reactions,
  commentCount,
  onReact,
  onComment,
  canReact = true,
  isAuthenticated = false
}: PostInteractionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/community/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReact = async (emoji: string) => {
    try {
      await onReact(emoji);
    } catch (error) {
      console.error('Error reacting:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setLoadingSubmit(true);
    try {
      await onComment(newComment);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      {/* Reactions */}
      {reactions && reactions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {reactions.map((reaction) => (
            <Badge 
              key={reaction.emoji}
              variant="outline" 
              className="bg-white/5 border-white/10 px-3 py-1.5 text-[10px] cursor-pointer hover:bg-white/10 transition-colors"
            >
              {reaction.emoji} <span className="ml-1">{reaction.count}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Reaction Buttons */}
      {isAuthenticated && (
        <div className="flex gap-2 flex-wrap">
          {EMOJI_REACTIONS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              onClick={() => handleReact(emoji)}
              className="text-lg hover:bg-white/10 px-2 h-8"
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}

      {/* Comments Toggle */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-white/60 hover:text-white gap-2 text-[10px] font-bold uppercase"
        >
          <MessageSquare className="w-4 h-4" />
          {commentCount} {commentCount === 1 ? 'Comentario' : 'Comentarios'}
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <Card className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
          {isAuthenticated && (
            <div className="flex gap-3">
              <Input
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                className="bg-white/5 border-white/10 rounded-xl text-sm placeholder-white/30"
              />
              <Button
                size="icon"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || loadingSubmit}
                className="bg-accent hover:bg-accent/80 text-black h-10 w-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {loadingComments ? (
            <div className="text-center text-white/40 text-sm py-4">Cargando comentarios...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  {comment.avatar_url && (
                    <img
                      src={comment.avatar_url}
                      alt={comment.first_name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-white">
                          {comment.first_name} {comment.last_name}
                        </p>
                        <p className="text-white/60 text-[10px]">{formatDate(comment.created_at)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0a0a0c] border-white/10 text-white">
                          <DropdownMenuItem className="text-red-400 cursor-pointer focus:bg-red-500/10">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-white/80 mt-2">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/40 text-sm py-4">
              {isAuthenticated ? 'Sé el primero en comentar' : 'Inicia sesión para comentar'}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';
import { api } from '@/service/api';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';

interface Post {
  id: number;
  titulo: string;
  descricao: string;
  dataPublicacao: string;
  caminhoImagem: string;
  autorID: number;
}

export default function PostViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const id = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Erro ao carregar postagem", error);
        router.push('/feed'); // Redireciona se der erro
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, router]);

  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3333/uploads/${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex justify-center items-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans pb-20">
      
      {/* Botão Voltar */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/feed">
          <button className="flex items-center gap-2 text-brand-text hover:text-white transition-colors">
            <ArrowLeft size={20} />
            Voltar para o Feed
          </button>
        </Link>
      </div>

      {/* Conteúdo do Artigo */}
      <article className="max-w-4xl mx-auto bg-brand-surface rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        
        {/* Imagem de Capa */}
        <div className="w-full h-64 md:h-96 bg-brand-dark relative overflow-hidden">
          {post.caminhoImagem ? (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url("${getImageUrl(post.caminhoImagem)}")` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent opacity-80"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-brand-text">Sem imagem de capa</span>
            </div>
          )}
          
          {/* Título sobre a imagem (Mobile/Desktop) */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium">
              <span className="flex items-center gap-2 bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/30 backdrop-blur-md">
                <Calendar size={14} /> {formatDate(post.dataPublicacao)}
              </span>
              <span className="flex items-center gap-2 bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md">
                <User size={14} /> Autor ID: {post.autorID}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-lg">
              {post.titulo}
            </h1>
          </div>
        </div>

        {/* Corpo do Texto */}
        <div className="p-6 md:p-10 text-lg leading-relaxed text-gray-300 space-y-6">
          {/* Aqui estamos renderizando a descrição como conteúdo. 
              Se futuramente tiver um campo 'conteudo' rico (HTML/Markdown), altere aqui. */}
          {post.descricao.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      </article>
    </div>
  );
}
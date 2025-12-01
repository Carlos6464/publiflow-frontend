"use client";

import React, { useState, useContext, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, BookOpen, LogOut, User, Loader2, Calendar, LayoutDashboard } from 'lucide-react'; // <--- Importei LayoutDashboard
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/service/api';

// ... (MANTENHA AS INTERFACES Post E PaginatedResponse IGUAIS) ...
interface Post {
  id: number;
  titulo: string;
  descricao: string;
  visibilidade: boolean;
  dataPublicacao: string;
  caminhoImagem: string;
  autorID: number;
}

interface PaginatedResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function FeedPage() {
  const { user, signOut } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ... (MANTENHA OS ESTADOS E O FETCHPOST IGUAIS) ...
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse>('/posts/feed', {
        params: {
          page: currentPage,
          limit: 6,
          q: debouncedSearch
        }
      });
      setPosts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateString));
  };

  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/800x450?text=Sem+Imagem";
    if (path.startsWith('http')) return path;
    return `http://localhost:3333/uploads/${path}`;
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-primary selection:text-white">
      
      {/* --- Header / Navbar --- */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-surface/80 backdrop-blur-lg px-6 py-4 shadow-lg">
         <div className="mx-auto flex max-w-7xl items-center justify-between">
           
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-rose-600 shadow-lg shadow-brand-primary/20">
               <BookOpen className="text-white" size={24} />
             </div>
             <span className="text-xl font-bold tracking-tight text-white hidden sm:block">PubliFlow</span>
           </div>
           
           {/* NAVEGAÇÃO CENTRAL */}
           <nav className="hidden md:flex items-center gap-6">
             {/* Link exclusivo para Professores */}
             {user?.role === 'teacher' && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-brand-primary/10"
                >
                   <LayoutDashboard size={16} />
                   Painel Administrativo
                </Link>
             )}

           </nav>

           <div className="flex items-center gap-4">
             {/* ... (SINOS E AVATAR IGUAIS AO ANTERIOR) ... */}
             <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-2 group focus:outline-none">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-medium text-white">{user?.name}</p>
                     <p className="text-xs text-brand-text capitalize">{user?.role === 'teacher' ? 'Professor' : 'Aluno'}</p>
                  </div>
                   <div className={`h-10 w-10 rounded-full border-2 bg-white/5 flex items-center justify-center text-brand-text ${isProfileOpen ? 'border-brand-primary' : 'border-white/10'}`}>
                    <User size={20} />
                  </div>

                </button>
                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#333333] border border-white/10 shadow-2xl z-50">
                     <div className="py-1">
                        {/* Se for professor, adiciona link no dropdown também para mobile */}
                        {user?.role === 'teacher' && (
                           <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-primary hover:bg-white/5 font-bold">
                              <LayoutDashboard size={18} /> Painel Admin
                           </Link>
                        )}
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-primary hover:bg-white/5 font-bold">
                            <User size={18} /> Meu Perfil
                        </Link>
                        <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 border-t border-white/5">
                           <LogOut size={18} /> Sair do Sistema
                        </button>
                     </div>
                  </div>
                )}
             </div>
           </div>
         </div>
      </header>

      {/* --- Conteúdo Principal (MANTIDO IGUAL) --- */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Publicações Recentes
            </h1>
            <p className="mt-2 text-brand-text">Página {currentPage} de {totalPages}</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-brand-text" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border-none bg-brand-surface py-3 pl-12 pr-4 text-white shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/50 transition-all"
              placeholder="Pesquisar no servidor..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="animate-spin text-brand-primary" size={48} />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-text">
            <BookOpen size={48} className="mb-4 opacity-50" />
            <p className="text-lg">Nenhum resultado encontrado para &quot;{debouncedSearch}&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-brand-surface border border-white/5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/10 h-full">
                <div className="aspect-video w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${getImageUrl(post.caminhoImagem)}")` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary border border-brand-primary/20 uppercase">POSTAGEM</span>
                    <span className="text-xs text-brand-text flex items-center gap-1"><Calendar size={12} /> {formatDate(post.dataPublicacao)}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold leading-tight text-white group-hover:text-brand-primary transition-colors line-clamp-2">{post.titulo}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-3">{post.descricao}</p>
                  <Link 
                    href={`/post/${post.id}`} 
                    className="group/btn flex items-center gap-2 text-sm font-bold text-brand-primary transition-all hover:text-brand-secondary self-start mt-auto"
                  >
                    Ler artigo completo <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface text-brand-text hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
               if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
                 return (
                   <button key={number} onClick={() => goToPage(number)} className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${currentPage === number ? 'bg-brand-primary text-white font-bold shadow-lg' : 'bg-brand-surface text-brand-text hover:bg-white/10 hover:text-white'}`}>
                      {number}
                   </button>
                 );
               } else if (number === currentPage - 2 || number === currentPage + 2) {
                 return <span key={number} className="text-brand-text">...</span>;
               }
               return null;
            })}

            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface text-brand-text hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
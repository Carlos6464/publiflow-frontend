"use client";

import  { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/service/api';
import Swal from 'sweetalert2'; //

// Tipagem dos dados
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

export default function AdminDashboard() {
  // Estados
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Busca os dados da API
  const fetchMyPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse>('/posts/me', {
        params: {
          page: currentPage,
          limit: 2, // Admin vê mais itens por vez
        }
      });
      setPosts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
      setTotalItems(response.data.meta.total);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // Função de Deletar
  const handleDelete = async (id: number) => {
     const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F41958', // Cor Primária (Rosa)
      cancelButtonColor: '#333333',  // Cor de Superfície (Cinza)
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#1E1E1E', // Fundo Dark para combinar com o site
      color: '#FFFFFF',      // Texto Branco
      iconColor: '#F41958'   // Ícone Rosa
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/posts/${id}`);
        
        // Feedback de Sucesso
        await Swal.fire({
          title: 'Excluído!',
          text: 'A postagem foi removida com sucesso.',
          icon: 'success',
          confirmButtonColor: '#F41958',
          background: '#1E1E1E',
          color: '#FFFFFF'
        });

        fetchMyPosts(); // Recarrega a lista
      } catch (error) {
        console.error(error);
        // Feedback de Erro
        Swal.fire({
          title: 'Erro!',
          text: 'Ocorreu um erro ao tentar excluir a postagem.',
          icon: 'error',
          confirmButtonColor: '#F41958',
          background: '#1E1E1E',
          color: '#FFFFFF'
        });
      }
    }
  };

  // Formatador de Data
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Postagens</h1>
          <p className="text-brand-text mt-1">
            Você tem um total de <strong className="text-white">{totalItems}</strong> publicações.
          </p>
        </div>
        
        <Link href="/admin/post">
          <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 w-full md:w-auto justify-center">
            <Plus size={20} />
            Nova Postagem
          </button>
        </Link>
      </div>

      {/* Tabela */}
      <div className="bg-brand-surface rounded-xl shadow-xl overflow-hidden border border-white/5">
        
        {loading ? (
          <div className="p-12 flex justify-center">
             <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-brand-text">
            Você ainda não criou nenhuma postagem.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-brand-text text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Título</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-brand-text">#{post.id}</td>
                    
                    <td className="px-6 py-4 font-medium text-white max-w-xs truncate">
                      {post.titulo}
                    </td>
                    
                    <td className="px-6 py-4">
                      {post.visibilidade ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          Rascunho
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-brand-text">
                      {formatDate(post.dataPublicacao)}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-100">
                        
                        {/* --- LINK DE EDITAR (Com ID) --- */}
                        <Link href={`/admin/post/${post.id}`}>
                          <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Editar">
                            <Edit size={18} />
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm text-brand-text">
            <span>
              Página <strong className="text-white">{currentPage}</strong> de {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
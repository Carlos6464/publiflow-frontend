"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UploadCloud, X, Save, Loader2, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { api } from '@/service/api';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PostFormPage() {
  const router = useRouter();
  const params = useParams();
  
  // Lógica inteligente para detectar o ID na URL
  // Em rotas [[...id]], o params.id é um array (ex: ['123']) ou undefined
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = rawId ? Number(rawId) : null;
  const isEditMode = !!id;

  // Estados do Formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [visibilidade, setVisibilidade] = useState(true);
  
  // Estado para imagem (Arquivo novo ou URL antiga)
  const [imagemNova, setImagemNova] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Estados de Carregamento
  const [loading, setLoading] = useState(false); // Salvando
  const [fetching, setFetching] = useState(isEditMode); // Buscando dados iniciais (só se for edição)

  // 1. BUSCAR DADOS (Apenas se for Modo Edição)
  const fetchPostData = useCallback(async () => {
    if (!isEditMode || !id) return;

    try {
      const response = await api.get(`/posts/${id}`);
      const post = response.data;
      
      setTitulo(post.titulo);
      setDescricao(post.descricao);
      setVisibilidade(post.visibilidade);
      
      if (post.caminhoImagem) {
        setPreview(`http://localhost:3333/uploads/${post.caminhoImagem}`);
      }
    } catch (error) {
      console.error("Erro ao buscar postagem", error);
      alert("Erro ao carregar dados da postagem.");
      router.push('/admin');
    } finally {
      setFetching(false);
    }
  }, [id, isEditMode, router]);

  useEffect(() => {
    if (isEditMode) {
      fetchPostData();
    }
  }, [fetchPostData, isEditMode]);

  // Manipular troca de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemNova(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 2. ENVIAR FORMULÁRIO (POST ou PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica para criação
    if (!isEditMode && !imagemNova) {
      toast.warning("Por favor, selecione uma imagem de capa.");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Salvando postagem...");
    
    try {
      const data = new FormData();
      data.append('titulo', titulo);
      data.append('descricao', descricao);
      data.append('visibilidade', String(visibilidade));
      
      if (imagemNova) {
        data.append('imagem', imagemNova);
      }

      if (isEditMode) {
        // MODO EDIÇÃO: PUT
        await api.put(`/posts/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Postagem atualizada com sucesso!", { id: toastId });
      } else {
        // MODO CRIAÇÃO: POST
        await api.post('/posts', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Postagem criada com sucesso!", { id: toastId });
      }

      router.push('/admin');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao salvar postagem.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Tela de carregamento enquanto busca os dados da edição
  if (fetching) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="mb-8">
          {isEditMode && (
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                    Editando ID #{id}
                </span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "Editar Postagem" : "Adicionar Nova Postagem"}
          </h1>
          <p className="text-brand-text mt-1">
            {isEditMode 
              ? "Altere os campos abaixo para atualizar a publicação." 
              : "Preencha os campos abaixo para criar uma nova publicação."}
          </p>
        </div>

         <Link href="/admin">
          <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 w-full md:w-auto justify-center">
            <ChevronLeft size={20} />
            Voltar
          </button>
        </Link>
       </div>

      <div className="bg-brand-surface rounded-xl shadow-xl border border-white/5 p-6 md:p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Título</label>
            <input 
              type="text" 
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              placeholder="Digite o título..."
            />
          </div>

          {/* Status (Visibilidade) */}
          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Visibilidade</label>
            <div className="flex items-center gap-4 bg-brand-dark p-4 rounded-xl border border-white/10">
              <span className={visibilidade ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                {visibilidade ? "Publicado (Visível)" : "Rascunho (Oculto)"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer ml-auto">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={visibilidade}
                  onChange={(e) => setVisibilidade(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Conteúdo</label>
            <textarea 
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all min-h-[200px]"
              placeholder="Escreva o conteúdo da sua postagem aqui..."
            ></textarea>
          </div>

          {/* Upload de Imagem */}
          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Imagem de Capa</label>
            
            <div className="relative border-2 border-dashed border-white/20 rounded-xl bg-brand-dark overflow-hidden group hover:border-brand-primary/50 transition-all">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {preview ? (
                <div className="relative w-full h-64">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2">
                        <UploadCloud /> {isEditMode ? "Substituir Imagem" : "Alterar Imagem"}
                      </p>
                   </div>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-brand-surface rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} className="text-brand-primary" />
                  </div>
                   <p className="text-white font-medium">Clique ou arraste uma imagem aqui</p>
                   <p className="text-brand-text text-sm mt-1">PNG, JPG ou JPEG</p>
                </div>
              )}
            </div>
            {isEditMode && <p className="text-xs text-brand-text mt-2">* Se não selecionar uma nova, a imagem atual será mantida.</p>}
          </div>

          {/* Botões */}
          <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-white/5 mt-2">
            <Link href="/admin">
              <button type="button" className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium flex items-center gap-2">
                <X size={18} /> Cancelar
              </button>
            </Link>
            
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white shadow-lg transition-all font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditMode ? "Salvar Alterações" : "Publicar Postagem"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, User, ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import { api } from '@/service/api';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Pega o usuário do contexto (ID e Role)

  // Estados do Formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // Estados de Interface
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Buscar dados do usuário ao carregar
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;

      try {
        const response = await api.get(`/users/${user.id}`);
        const userData = response.data;
        
        setNomeCompleto(userData.nomeCompleto);
        setEmail(userData.email);
        setTelefone(userData.telefone);
      } catch (error) {
        console.error("Erro ao buscar perfil", error);
        toast.error("Não foi possível carregar seus dados.");
      } finally {
        setFetching(false);
      }
    }

    fetchUserData();
  }, [user]);

  // 2. Atualizar dados (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    const toastId = toast.loading("Atualizando perfil...");

    try {
      await api.put(`/users/${user.id}`, {
        nomeCompleto,
        email,
        telefone,
        // O papelUsuarioID não é enviado pois não deve ser alterado aqui
      });

      toast.success("Perfil atualizado com sucesso!", { id: toastId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao atualizar perfil.";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Define para onde o botão "Voltar" aponta baseado no papel
  const backLink = user?.role === 'teacher' ? '/admin' : '/feed';

  if (fetching) {
    return (
        <div className="min-h-screen bg-brand-dark flex justify-center items-center">
            <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Simples */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={backLink}>
            <button className="p-2 bg-brand-surface rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-brand-text">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <div className="bg-brand-surface rounded-xl shadow-xl border border-white/5 p-6 md:p-8">
          
          {/* Avatar (Visual apenas) */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-brand-dark border-4 border-brand-primary flex items-center justify-center mb-4 overflow-hidden">
                <User size={40} className="text-brand-primary" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-sm font-bold">
                <Shield size={14} />
                {user?.role === 'teacher' ? 'Conta de Professor' : 'Conta de Aluno'}
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            
            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <User size={18} className="text-brand-primary" /> Nome Completo
              </label>
              <input 
                type="text" 
                required
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Mail size={18} className="text-brand-primary" /> Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Phone size={18} className="text-brand-primary" /> Telefone
              </label>
              <input 
                type="tel" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-white/5 mt-2">
              <Link href={backLink}>
                <button type="button" className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">
                  Cancelar
                </button>
              </Link>
              
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white shadow-lg transition-all font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Salvar Alterações
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
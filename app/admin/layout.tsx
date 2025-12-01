"use client";

import React, { useContext, useState } from 'react'; // 1. Importe useState
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, User, LogOut, Menu, Newspaper, X } from 'lucide-react'; // Importe X para fechar
import { AuthContext } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useContext(AuthContext);
  
  // 2. Estado para controlar o menu mobile
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Lógica de Menu Ativo
  const isPostsActive = pathname === '/admin' || pathname.startsWith('/admin/post');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-dark text-white">
      
      {/* --- Sidebar --- */}
      {/* Adicionei 'h-auto min-h-0' no mobile para ele crescer quando abrir */}
      <aside className={`w-full md:w-64 bg-brand-surface shadow-xl flex flex-col shrink-0 md:h-screen sticky top-0 z-50 transition-all duration-300 ${isMobileOpen ? 'h-screen' : 'h-auto'}`}>
        
        {/* Header da Sidebar */}
        <div className="p-6 flex items-center justify-between md:justify-start gap-3">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold">P</div>
              <span className="text-xl font-bold tracking-tight">PubliFlow</span>
           </div>
           
           {/* Botão Menu Mobile com Toggle */}
           <button 
             className="md:hidden text-white focus:outline-none"
             onClick={() => setIsMobileOpen(!isMobileOpen)}
           >
             {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>

        {/* Perfil do Professor */}
        {/* Lógica: Se mobile aberto OU desktop -> mostra. Senão -> esconde. */}
        <div className={`px-6 pb-6 border-b border-white/5 ${isMobileOpen ? 'block' : 'hidden'} md:block`}>
          <Link href="/profile" className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full border-2 border-brand-primary bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                <User size={20} />
              </div>
            
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-white truncate group-hover:text-brand-primary transition-colors">{user?.name || 'Professor'}</h3>
              <p className="text-xs text-brand-text">Administrador</p>
            </div>
          </Link>
        </div>

        {/* Navegação */}
        <nav className={`flex-1 px-4 py-6 space-y-2 overflow-y-auto ${isMobileOpen ? 'flex' : 'hidden'} md:flex flex-col`}>
          
          <Link 
            href="/admin" 
            onClick={() => setIsMobileOpen(false)} // Fecha menu ao clicar
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isPostsActive 
                ? 'bg-brand-primary text-white shadow-lg' 
                : 'text-brand-text hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">Minhas Postagens</span>
          </Link>

          {/* Link Feed */}
          <Link 
            href="/feed" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text hover:bg-white/5 hover:text-white transition-all mt-4 border-t border-white/5 pt-4"
          >
            <Newspaper size={20} />
            <span className="font-medium">Ver Feed</span>
          </Link>

        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-white/5 ${isMobileOpen ? 'block' : 'hidden'} md:block`}>
          <button 
            onClick={signOut} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* --- Área de Conteúdo Principal --- */}
      {/* Esconde o conteúdo principal no mobile se o menu estiver aberto, para focar no menu */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto h-screen ${isMobileOpen ? 'hidden md:block' : 'block'}`}>
        {children}
      </main>
    </div>
  );
}
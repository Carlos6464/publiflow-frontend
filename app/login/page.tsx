"use client";

import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Loader2, User, Phone } from 'lucide-react'; // Adicionado ícones User e Phone
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/service/api'; // Importar API para o cadastro
import { toast } from 'sonner'; // Importar toast para feedback

export default function LoginPage() {
  const { signIn } = useContext(AuthContext);

  // Estados de UI
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Alterna entre Login e Cadastro
  
  // Estados do Formulário
  const [firstName, setFirstName] = useState(''); // Alterado: Nome
  const [lastName, setLastName] = useState('');   // Novo: Sobrenome
  const [phone, setPhone] = useState(''); // Novo campo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função Principal (Login ou Cadastro)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // --- LÓGICA DE CADASTRO ---
        
        // Mapeia o papel selecionado para o ID do banco (1=Aluno, 2=Professor)
        const papelUsuarioID = userType === 'teacher' ? 2 : 1;

        await api.post('/users', {
          nome: firstName,
          sobrenome: lastName, 
          email,
          senha: password,
          telefone: phone,
          papelUsuarioID
        });

        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setIsRegistering(false); // Volta para a tela de login
        setPassword(''); // Limpa a senha por segurança

      } else {
        // --- LÓGICA DE LOGIN ---
        await signIn({ 
          email, 
          password, 
          type: userType
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Ocorreu um erro. Tente novamente.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Função para alternar modo e limpar erros
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    // Limpa campos opcionais ao trocar
    if (!isRegistering) {
      setFirstName('');
      setLastName('');
      setPhone('');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-brand-dark text-white overflow-hidden p-4 font-sans">
      
      {/* --- Elementos de Fundo --- */}
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-brand-primary/30 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]"></div>

      {/* --- Card de Login/Cadastro --- */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center">
        <div className="w-full rounded-xl bg-brand-surface/90 border border-white/10 shadow-lg p-8 backdrop-blur-lg transition-all duration-300">
          
          <div className="flex flex-col items-center">
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-2">
              PubliFlow
            </h1>
            <p className="text-brand-text mb-6 text-sm">
              {isRegistering ? 'Crie sua conta acadêmica' : 'Bem-vindo de volta'}
            </p>
          </div>

          {/* Abas (Visual) */}
          <div className="flex h-12 w-full items-center justify-center rounded-lg bg-black/20 p-1 mb-6">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex h-full grow items-center justify-center rounded-md px-2 text-sm font-medium transition-all duration-300 ${
                userType === 'student'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-text hover:text-white'
              }`}
            >
              Sou Aluno
            </button>
            <button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`flex h-full grow items-center justify-center rounded-md px-2 text-sm font-medium transition-all duration-300 ${
                userType === 'teacher'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-text hover:text-white'
              }`}
            >
              Sou Professor
            </button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Campos Extras de Cadastro */}
            {isRegistering && (
              <>
                <div className="flex gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="flex flex-col w-1/2">
                    <p className="text-white text-base font-medium pb-2">Nome</p>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-brand-text" size={20} />
                      <input 
                        type="text"
                        required={isRegistering}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/20 bg-white/5 h-12 placeholder:text-gray-500 pl-12 pr-4 text-base transition-colors"
                        placeholder="João"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col w-1/2">
                    <p className="text-white text-base font-medium pb-2">Sobrenome</p>
                    <div className="relative">
                      <input 
                        type="text"
                        required={isRegistering}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/20 bg-white/5 h-12 placeholder:text-gray-500 px-4 text-base transition-colors"
                        placeholder="Silva"
                      />
                    </div>
                  </label>
                </div>

                <label className="flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-300 delay-75">
                  <p className="text-white text-base font-medium pb-2">Telefone</p>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-brand-text" size={20} />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/20 bg-white/5 h-12 placeholder:text-gray-500 pl-12 pr-4 text-base transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </label>
              </>
            )}

            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium pb-2">Email</p>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/20 bg-white/5 h-12 placeholder:text-gray-500 p-4 text-base transition-colors"
                placeholder={userType === 'student' ? "rm12345@fiap.com.br" : "professor@fiap.com.br"}
              />
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium pb-2">Senha</p>
              <div className="relative flex w-full items-center">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/20 bg-white/5 h-12 placeholder:text-gray-500 p-4 pr-12 text-base transition-colors"
                  placeholder="Digite sua senha"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-brand-text hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <div className="mt-6">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-brand-primary text-white text-base font-bold tracking-wide hover:bg-brand-secondary transition-colors duration-300 shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processando...
                  </>
                ) : (
                  isRegistering 
                    ? `Cadastrar como ${userType === 'student' ? 'Aluno' : 'Professor'}`
                    : `Entrar como ${userType === 'student' ? 'Aluno' : 'Professor'}`
                )}
              </button>
            </div>

          </form>

          {/* Rodapé do Card - Alterna entre Cadastro e Login */}
          <div className="flex justify-end items-center text-sm mt-6 text-brand-text">
            <span className="text-brand-text">
              {isRegistering ? "Já tem uma conta? " : "Não tem conta? "}
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-brand-primary font-semibold hover:underline cursor-pointer ml-1 focus:outline-none"
              >
                {isRegistering ? "Entrar" : "Cadastre-se"}
              </button>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
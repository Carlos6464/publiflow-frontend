"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { api } from "@/service/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
};

type APIResponse = {
  user: {
    id: number;
    nomeCompleto: string;
    telefone: string;
    email: string;
    dataCadastro: string;
    papelUsuarioID: number;
  };
  token: string;
};

// Adicionamos 'type' aqui para receber a aba selecionada
type SignInData = {
  email: string;
  password: string;
  type: 'student' | 'teacher';
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  loading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { 'publiflow.token': token, 'publiflow.user': userCookie } = parseCookies();

    if (token && userCookie) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setTimeout(() => setUser(JSON.parse(userCookie)), 0);
    }
    
    setTimeout(() => setLoading(false), 0);
  }, []);

  async function signIn({ email, password, type }: SignInData) {
    try {
      // 1. Chamada para a API
      const response = await api.post<APIResponse>('/login', { 
        email, 
        senha: password 
      });

      const { token, user: apiUser } = response.data;

      // 2. Mapeamento de Papéis (ID 2 = Teacher, ID 1 = Student)
      const role = apiUser.papelUsuarioID === 2 ? 'teacher' : 'student';

      // --- VALIDAÇÃO DE SEGURANÇA (NOVA) ---
      // Se o papel do banco não bater com a aba selecionada, bloqueia
      if (role !== type) {
        throw new Error(
          type === 'teacher' 
            ? "Acesso negado: Esta conta é de Aluno, use a aba 'Sou Aluno'." 
            : "Acesso negado: Esta conta é de Professor, use a aba 'Sou Professor'."
        );
      }

      const formattedUser: User = {
        id: apiUser.id,
        name: apiUser.nomeCompleto,
        email: apiUser.email,
        role: role,
        avatar: `https://i.pravatar.cc/150?u=${apiUser.id}`
      };

      // 3. Cookies
      setCookie(undefined, 'publiflow.token', token, { maxAge: 60 * 60 * 24 * 30, path: '/' });
      setCookie(undefined, 'publiflow.role', role, { maxAge: 60 * 60 * 24 * 30, path: '/' });
      setCookie(undefined, 'publiflow.user', JSON.stringify(formattedUser), { maxAge: 60 * 60 * 24 * 30, path: '/' });

      // 4. Configurar Estado
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setUser(formattedUser);

      // 5. Redirecionamento
      if (role === 'teacher') {
        router.push('/admin');
      } else {
        router.push('/feed');
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao logar", err);
      // Repassa a mensagem exata se for erro de validação de papel
      if (err.message && err.message.includes("Acesso negado")) {
        throw err;
      }
      throw new Error("Falha no login. Verifique email e senha.");
    }
  }

  function signOut() {
    destroyCookie(undefined, 'publiflow.token');
    destroyCookie(undefined, 'publiflow.role');
    destroyCookie(undefined, 'publiflow.user');
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
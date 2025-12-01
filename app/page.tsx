import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona imediatamente o usuário da rota raiz "/" para "/login"
  redirect('/login');
}
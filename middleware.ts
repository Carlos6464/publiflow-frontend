import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pega o token e o role dos cookies
  const token = request.cookies.get('publiflow.token')?.value;
  const role = request.cookies.get('publiflow.role')?.value;

  // Rotas que exigem login
  const protectedRoutes = ['/feed', '/admin'];
  
  // Rotas exclusivas de professor
  const teacherRoutes = ['/admin'];

  // Verifica se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  const isTeacherRoute = teacherRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // CASO 1: Usuário não logado tentando acessar rota protegida
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // CASO 2: Usuário logado tentando acessar login (manda pro feed/admin)
  if (request.nextUrl.pathname === '/login' && token) {
    if (role === 'teacher') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // CASO 3: Aluno tentando acessar área de Admin
  if (isTeacherRoute && role === 'student') {
    // Redireciona o aluno "espertinho" de volta pro feed
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

// Configura em quais rotas o middleware deve rodar
export const config = {
  matcher: ['/feed/:path*', '/admin/:path*', '/login'],
};
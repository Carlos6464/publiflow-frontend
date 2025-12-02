import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'publiflow.token': token } = parseCookies();

export const api = axios.create({
  // Tenta usar a variável de ambiente; se não achar, usa o localhost padrão
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
});

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
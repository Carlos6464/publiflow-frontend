import axios from 'axios';
import { parseCookies } from 'nookies';

// Pega os cookies logo no início para configurar a instância
const { 'publiflow.token': token } = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333/api', // Sua API local
});

// Se tiver token, já coloca no cabeçalho de todas as requisições
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
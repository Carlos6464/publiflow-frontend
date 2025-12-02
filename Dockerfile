# Estágio 1: Instalação de dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Estágio 2: Builder (Construção do projeto)
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria do Next.js (opcional)
ENV NEXT_TELEMETRY_DISABLED 1

# Gera a pasta de build (.next)
RUN npm run build

# Estágio 3: Runner (Imagem final de produção)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Cria um usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia apenas os arquivos necessários para rodar
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Define permissões
USER nextjs

# Expõe a porta 3000
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
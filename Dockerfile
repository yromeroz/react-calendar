# Etapa 1: Build
FROM node:18-alpine AS builder

# Definir directorio de trabajo
WORKDIR /app

# Copiar solo lo necesario para instalar dependencias
COPY package*.json ./

# Instalar dependencias (usa la que tengas en tu proyecto)
RUN npm install --fetch-timeout=60000 --cache-min=86400

# Copiar el resto del código
COPY . .

# Generar el build de producción
RUN npm run build

# ------------------------------

# Etapa 2: Runtime
FROM node:18-alpine AS runner

WORKDIR /app

#ENV NODE_ENV=production

# Copiar solo archivos necesarios desde el builder
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Puerto expuesto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]

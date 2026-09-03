# Usar imagem Node com Debian Bullseye para compatibilidade com ffmpeg
FROM node:20-bullseye-slim

# Instalar ffmpeg do sistema (recomendado pelo discord-player)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (cache de layers)
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --omit=dev

# Copiar o restante do código
COPY . .

# Variável para indicar ambiente de produção
ENV NODE_ENV=production

# Iniciar o bot
CMD ["node", "index.js"]

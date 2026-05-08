# Usamos una versión ligera de Node.js
FROM node:22-alpine

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero
COPY package*.json ./

# Instalamos los módulos de Node
RUN npm install

# Copiamos todo el resto del código
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para iniciar tu servidor
CMD ["node", "src/app.js"]
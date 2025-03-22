FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .
RUN chmod +x node_modules/.bin/vite

USER root
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
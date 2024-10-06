FROM oven/bun:latest
WORKDIR /Docker_Compose/frontend
COPY package.json .
RUN bun install
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev"]

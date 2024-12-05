FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive

COPY backend/ ./

CMD ["yarn", "start"]

FROM node:18

WORKDIR /backend-app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive

COPY . .

CMD ["yarn", "start"]

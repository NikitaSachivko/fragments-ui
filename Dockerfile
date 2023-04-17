# Stage 0: install the base dependencies
FROM node:16.13.2-alpine AS dependencies

LABEL mantainer="Nikita Sachivko <nsachivko@myseneca.ca>" \
    description="fragments-ui web app"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production

WORKDIR /site

COPY package*.json ./

RUN npm ci --silent



# Stage 1:
FROM node:16.13.2-alpine as build

WORKDIR /site

# Copy node modules
COPY --from=dependencies /site /site

# Copy source code
COPY . .

RUN npm run build

CMD ["npm", "run", "start"]


HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
    CMD curl --fail localhost || exit 1















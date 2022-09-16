# # Install dependencies only when needed
# FROM node:14-alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# # RUN apk add --no-cache libc6-compat
# WORKDIR /app
# # COPY package.json yarn.lock ./
# # RUN yarn install --frozen-lockfile

# # If using npm with a `package-lock.json` comment out above and use below instead
# # AWS seems to have issues with old package-lock files, I have not included so that it is created on build
# COPY package.json .
# RUN npm i

# # Rebuild the source code only when needed
# FROM node:14-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /app/package-lock.json ./package-lock.json
# COPY . .


# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
# # ENV NEXT_TELEMETRY_DISABLED 1

# # RUN yarn build

# # If using npm comment out above and use below instead
# RUN npm run build

# # Production image, copy all the files and run next
# FROM node:14-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # You only need to copy next.config.js if you are NOT using the default configuration
# # COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# # Automatically leverage output traces to reduce image size 
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# CMD ["node", "server.js"]

# stage1 as builder
FROM node:14-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install && mkdir /nextjs-ui && mv ./node_modules ./nextjs-ui

WORKDIR /nextjs-ui

COPY . .

# Build the project and copy the files
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /nextjs-ui/out /usr/share/nginx/html

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
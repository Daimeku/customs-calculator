FROM node:current-slim as node

WORKDIR /app/customs-calc

ENV PATH /app/customs-calc/node_modules/.bin:$PATH

COPY . ./

RUN npm install

RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/customs-calc/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
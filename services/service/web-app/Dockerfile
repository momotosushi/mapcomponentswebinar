FROM node:18 as node_builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn
RUN yarn build

FROM nginxinc/nginx-unprivileged:1.21

COPY --from=node_builder /usr/src/app/dist /usr/share/nginx/html
COPY --from=node_builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
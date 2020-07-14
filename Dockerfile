FROM node:8-alpine as build
RUN apk add git
COPY ./ /opt/app
WORKDIR /opt/app
RUN npm ci && \
    npx gulp install && \
    npx gulp js css html assets

FROM nginx
COPY --from=build /opt/app/dist /usr/share/nginx/html

FROM node:18.14.1 AS build
WORKDIR /app/frontend
ADD package.json package-lock.json /app/frontend/
RUN npm i
# ADD archive-frontend.tar /app/frontend
ADD src /app/frontend/src
ADD public/ /app/frontend/public
RUN npm run build
# ENTRYPOINT ["npm"]
# CMD ["start"]
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/build /usr/share/nginx/html

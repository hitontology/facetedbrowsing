# syntax=docker/dockerfile:1
FROM node
WORKDIR /facetedbrowsing
COPY package.json .
# cache mount won't be part of the image
RUN --mount=type=cache,target=/facetedbrowsing/node_modules/ npm install && cp -r node_modules node_schmodules

FROM pierrezemb/gostatic
WORKDIR /srv/http
COPY --from=0 /facetedbrowsing/node_schmodules ./node_modules
COPY . .

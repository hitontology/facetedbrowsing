FROM node
WORKDIR /src
COPY . .
RUN npm install bower && npx bower install 

FROM pierrezemb/gostatic
WORKDIR /srv/http
COPY --from=0 /src/ .

FROM node
WORKDIR /bower
COPY bower.json .
RUN npm install bower@1.8.13 \
	&& npx bower install \
	&& ls | grep -v bower_components | xargs rm -rf

FROM pierrezemb/gostatic
WORKDIR /srv/http
COPY --from=0 /bower/ .
COPY . .

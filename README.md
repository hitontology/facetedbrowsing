# HITO SPARQL Faceter Test

[SPARQL Faceter](https://github.com/SemanticComputing/angular-semantic-faceted-search) prototype using HITO.
Based on the [SPARQL Faceter DBpedia demo](https://github.com/SemanticComputing/sparql-faceter-dbpedia-demo).

# Installation

`npm install bower`

`npx bower install`

# Running locally

You will need to serve the files with a server, for example python's built-in HTTP server:

`python3 -m http.server`

Then navigate to `http://localhost:8000`.

You can also execute the `run` script.

# Docker

    docker build -t hito-facetedbrowsing .
	facetedbrowsing$ docker run --network="host" hito-facetedbrowsing

# CORS
CORS needs to be activated in the SPARQL endpoint. [How to activate CORS in Virtuoso SPARQL](http://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksCORsEnableSPARQLURLs).

# HITO Faceted Search

Browse studies and software products of [HITO](https://hitontology.eu) using the [HITO SPARQL Endpoint](https://hitontology.eu/sparql).
Published at:
* <https://hitontology.eu/search/>
* <https://hitontology.eu/search/softwareproduct.html>
* <https://hitontology.github.io/facetedbrowsing>
* <https://hitontology.github.io/facetedbrowsing/softwareproduct.html>

Based on the [SPARQL Faceter DBpedia demo](https://github.com/SemanticComputing/sparql-faceter-dbpedia-demo).

# Build and Deploy
The faceted search is automatically built and deployed to the gh-pages branch using [a GitHub Action](/actions).
Testing the action locally with [act](https://github.com/nektos/act) is not supported as the deployment needs rsync and push rights.

# Install and Build locally

    npm install

# Run locally

You will need to serve the files with a server, for example python's built-in HTTP server:

`python3 -m http.server`

Then navigate to <http://localhost:8000> or <http://localhost:8000/softwareproduct.html>.

You can also execute the `run` script.

# Using Docker

    docker build -t hito-search .
	docker run --network="host" hito-search

Then open <http://0.0.0.0:8043> or <http://0.0.0.0:8043/softwareproduct.html> in a browser.

# CORS
CORS needs to be activated in the SPARQL endpoint. [How to activate CORS in Virtuoso SPARQL](http://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksCORsEnableSPARQLURLs).

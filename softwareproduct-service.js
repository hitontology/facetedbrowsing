(function () {
  'use strict';

  /* eslint-disable angular/no-service-method */

  // Module definition, note the dependency.
  angular
    .module('facetApp', ['seco.facetedSearch'])

    /*
     * softwareProduct service
     * Handles SPARQL queries and defines facet configurations.
     */
    .service('softwareProductService', softwareProductService);

  /* @ngInject */
  function softwareProductService(FacetResultHandler) {
    /* Public API */

    // Get the results from HITO based on the facet selections.
    this.getResults = getResults;
    // Get the facet definitions.
    this.getFacets = getFacets;
    // Get the facet options.
    this.getFacetOptions = getFacetOptions;

    /* Implementation */

    // Facet definitions
    // 'facetId' is a "friendly" identifier for the facet,
    //  and should be unique within the set of facets.
    // 'predicate' is the property that defines the facet (can also be
    //  a property path, for example).
    // 'name' is the title of the facet to show to the user.
    // If 'enabled' is not true, the facet will be disabled by default.
    var facets = {
      // Text search facet for names
      name: {
        facetId: 'name',
        predicate: '<http://www.w3.org/2000/01/rdf-schema#label>',
        enabled: true,
        name: 'Name',
      },
      // Basic facets
      applicationsystem: {
        facetId: 'applicationsystem',
        predicate: 'hito:spIsOfAstCit/hito:astCitClassifiedAs',
        enabled: true,
        name: 'Application System',
      },
      client: {
        facetId: 'client',
        predicate: 'hito:supportsClient',
        enabled: true,
        name: 'Client',
      },
      database: {
        facetId: 'database',
        predicate: 'hito:usesDbs',
        enabled: true,
        name: 'Database',
      },
      homepage: {
        facetId: 'homepage',
        predicate: 'hito:homepage',
        enabled: true,
        name: 'Homepage',
      },
      featurecitation: {
        facetId: 'featurecitation',
        predicate: 'hito:spOffersFCit',
        enabled: true,
        chart: true,
        name: 'Feature Citation',
      },
      featureclassified: {
        facetId: 'featureclassified',
        predicate: 'hito:spOffersFCit/hito:fCitClassifiedAs',
        enabled: true,
        chart: true,
        name: 'Feature',
      },
      functioncitation: {
        facetId: 'functioncitation',
        predicate: 'hito:spSupportsEfCit',
        enabled: true,
        chart: true,
        name: 'Function Citation',
      },
      functionclassified: {
        facetId: 'functionclassified',
        predicate: 'hito:spSupportsEfCit/hito:efCitClassifiedAs',
        enabled: true,
        chart: true,
        name: 'Function',
      },
      language: {
        facetId: 'language',
        predicate: 'hito:supportsLanguage',
        enabled: true,
        name: 'Language',
      },
      operatingsystem: {
        facetId: 'operatingsystem',
        predicate: 'hito:runsOnOs',
        enabled: true,
        chart: true,
        name: 'Operating System',
      },
      programminglanguage: {
        facetId: 'programminglanguage',
        predicate: 'hito:programmingLanguage',
        enabled: true,
        name: 'Programming Language',
      },
    };

    //const ENDPOINT_URL = 'https://www.snik.eu/sparql';
    const ENDPOINT_URL = 'https://hitontology.eu/sparql';
    const GRAPH = 'http://hitontology.eu/ontology';
    const GRAPH2 = 'http://dbpedia.org';
    const RESULTS_PER_PAGE = 100;

    // We are building a faceted search for writers.
    //        var rdfClass = '<http://hitontology.eu/ontology/NonExperimentalStudy>';

    // The facet configuration also accept a 'constraint' option.
    // The value should be a valid SPARQL pattern.
    // One could restrict the results further, e.g., to writers in the
    // science fiction firstAuthor by using the 'constraint' option:
    //
    var constraint = '?id a hito:SoftwareProduct.';
    //
    // Note that the variable representing a result in the constraint should be "?id".
    //
    // 'rdfClass' is just a shorthand constraint for '?id a <rdfClass> .'
    // Both rdfClass and constraint are optional, but you should define at least
    // one of them, or you might get bad results when there are no facet selections.
    var facetOptions = {
      endpointUrl: ENDPOINT_URL, // required
      //rdfClass: rdfClass, // optional
      usePost: true,
      constraint: constraint, // optional, not used in this demo
      preferredLang: 'en', // required
    };

    var prefixes =
      ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
      ' PREFIX dbp: <http://dbpedia.org/property/>' +
      ' PREFIX dbo: <http://dbpedia.org/ontology/>' +
      ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
      ' PREFIX hito: <http://hitontology.eu/ontology/>';

    // This is the result query, with <RESULT_SET> as a placeholder for
    // the result set subquery that is formed from the facet selections.
    // The variable names used in the query will be the property names of
    // the reusulting mapped objects.
    // Note that ?id is the variable used for the result resource here,
    // as in the constraint option.
    // Variable names with a '__' (double underscore) in them will results in
    // an object. I.e. here ?work__id, ?work__label, and ?work__link will be
    // combined into an object:
    // writer.work = { id: '[work id]', label: '[work label]', link: '[work link]' }
    //FILTER(langMatches(lang(?name), "en"))
    const queryTemplate = `SELECT * FROM <${GRAPH}> FROM <${GRAPH2}> WHERE
	{
         <RESULT_SET>
         OPTIONAL {
          ?id rdfs:label ?name .
         }
         OPTIONAL {
          ?id rdfs:isDefinedBy ?source.
         }
         OPTIONAL {?id hito:homepage ?homepage.}
         OPTIONAL {?id hito:programmingLanguage ?programminglanguage.}
         OPTIONAL {?id hito:license ?license. ?license rdfs:label ?licenselabel. filter(langmatches(lang(?licenselabel),"en") OR langmatches(lang(?licenselabel),""))}
         OPTIONAL {?id hito:runsOnOs ?os. ?os rdfs:label ?oslabel. filter(langmatches(lang(?oslabel),"en") OR langmatches(lang(?oslabel),""))}
        }`;
    /**OPTIONAL {
          ?id hito:evaluatesApplicationSystem ?informationSystem.
         }
         OPTIONAL {
          ?id hito:evaluatesApplicationSystemHavingFeature ?feature.
         }
         OPTIONAL {
          ?id hito:evaluatesApplicationSystemUsedInUnit ?unit.
         }
         OPTIONAL {
          ?id hito:evaluatesApplicationSystemBasedOnProduct ?product.
         }
	 */
    /* OPTIONAL {
          ?id dbp:deathDate ?deathDate .
         }
         OPTIONAL {
          ?id dbo:thumbnail ?depiction .
         }
         OPTIONAL {
          ?work__id dbo:author ?id ;
           rdfs:label ?work__label ;
           foaf:isPrimaryTopicOf ?work__link .
          FILTER(langMatches(lang(?work__label), "en"))
         }
         OPTIONAL {
          ?id dbo:notableWork/rdfs:label ?notableWork .
          FILTER(langMatches(lang(?notableWork), "en"))
         }
*/
    var resultOptions = {
      prefixes: prefixes, // required if the queryTemplate uses prefixes
      queryTemplate: queryTemplate, // required
      resultsPerPage: RESULTS_PER_PAGE, // optional (default is 10)
      pagesPerQuery: 1, // optional (default is 1)
      usePost: false,
      paging: true, // optional (default is true), if true, enable paging of the results
    };

    // FacetResultHandler is a service that queries the endpoint with
    // the query and maps the results to objects.
    var resultHandler = new FacetResultHandler(ENDPOINT_URL, resultOptions);

    // This function receives the facet selections from the controller
    // and gets the results from HITO.
    // Returns a promise.
    function getResults(facetSelections) {
      // If there are variables used in the constraint option (see above),
      // you can also give getResults another parameter that is the sort
      // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
      // The results are sorted by URI (?id) by default.
      return resultHandler.getResults(facetSelections).then(function (pager) {
        // We'll also query for the total number of results, and load the
        // first page of results.
        return pager
          .getTotalCount()
          .then(function (count) {
            pager.totalCount = count;
            return pager.getPage(0);
          })
          .then(function () {
            return pager;
          });
      });
    }

    // Getter for the facet definitions.
    function getFacets() {
      return facets;
    }

    // Getter for the facet options.
    function getFacetOptions() {
      return facetOptions;
    }
  }
})();

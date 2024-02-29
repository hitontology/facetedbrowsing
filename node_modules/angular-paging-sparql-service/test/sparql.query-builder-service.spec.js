/* global inject, module */
(function() {
    describe('QueryBuilderService', function() {
        var QueryBuilderService;

        beforeEach(module('sparql'));

        beforeEach(inject(function(_QueryBuilderService_) {
            QueryBuilderService = _QueryBuilderService_;
        }));

        describe('buildQuery', function() {
            it('builds a query out of a template and the result set', function() {
                var prefixes = 'prefixes';
                var resultSet = '?id <has> <stuff> .';
                var queryTemplate = 'SELECT * { <RESULT_SET> }';

                var builder = new QueryBuilderService(prefixes);

                var queryObject = builder.buildQuery(queryTemplate, resultSet);

                expect(queryObject.query).toContain(resultSet);
                expect(queryObject.query).toContain(prefixes);
            });
        });
    });
})();

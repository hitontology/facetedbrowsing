/* global inject, module */
(function() {
    describe('PagerService', function() {
        var $rootScope, $q, results, PagerService;

        beforeEach(module('sparql'));

        beforeEach(function() {
            results = [1, 2, 3, 4, 5, 6, 7];
        });

        beforeEach(inject(function(_$rootScope_, _$q_, _PagerService_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            PagerService = _PagerService_;
        }));

        var getResults = function() {
            return $q.when(results);
        };

        describe('getPage', function() {
            it('gets a page of results', function() {
                results = [1, 2, 3];

                var pager = new PagerService('', '', 3, getResults, 1, 7);

                var page;
                pager.getPage(0).then(function(res) {
                    page = res;
                });

                $rootScope.$apply();

                expect(results).toEqual(page);
            });
        });

        describe('getAll', function() {
            it('gets all results', function() {
                var pager = new PagerService('', '', 3, getResults, 1);
                var results = pager.getAll();

                $rootScope.$apply();

                var expectedResults = results;

                expect(results).toEqual(expectedResults);
            });

            it('fills the pages', function() {
                var pager = new PagerService('', '', 3, getResults, 1);
                pager.getAll();

                $rootScope.$apply();

                var expectedPages = [[1, 2, 3], [4, 5, 6], [7]];


                for (var i = 0; i < expectedPages.length; i++) {
                    var page;
                    pager.getPage(i).then(function(res) {
                        page = res;
                    });

                    $rootScope.$apply();

                    expect(page).toEqual(expectedPages[i]);
                }
            });
        });

        describe('getAllSequentially', function() {
            it('gets all results', function() {
                var pager = new PagerService('', '', 3, getResults, 1, 7);
                var results = pager.getAllSequentially(10);

                $rootScope.$apply();

                var expectedResults = results;

                expect(results).toEqual(expectedResults);
            });

            it('fills the pages', function() {
                var pager = new PagerService('', '', 3, getResults, 1, 7);
                pager.getAllSequentially(10);

                $rootScope.$apply();

                var expectedPages = [[1, 2, 3], [4, 5, 6], [7]];


                for (var i = 0; i < expectedPages.length; i++) {
                    var page;
                    pager.getPage(i).then(function(res) {
                        page = res;
                    });

                    $rootScope.$apply();

                    expect(page).toEqual(expectedPages[i]);
                }
            });
        });
    });
})();

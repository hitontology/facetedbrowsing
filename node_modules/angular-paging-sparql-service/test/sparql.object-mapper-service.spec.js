/* global inject, module, readJSON */
(function() {
    describe('objectMapperService', function() {
        beforeEach(module('sparql'));

        var objectMapperService, _;

        beforeEach(inject(function(_objectMapperService_, ___) {
            objectMapperService = _objectMapperService_;
            _ = ___;
        }));

        describe('makeObject', function() {
            it('makes a simple object out of a JSON SPARQL result', function() {
                var obj = readJSON('test/json/simple-object.json');
                var mapped = objectMapperService.makeObject(obj);

                var expected = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    label: 'Eduskunnan viimeinen kokous Kauhajoella.',
                    place: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    date: 'http://ldf.fi/warsa/events/times/time_1940-02-12-1940-02-12'
                };

                expect(mapped).toEqual(expected);
            });

            it('it creates objects out of variables containing "__"', function() {
                var obj = readJSON('test/json/deep-object.json');
                var mapped = objectMapperService.makeObject(obj);
                var expectedPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    label: 'Kauhajoki',
                    point: {
                        lat: '1',
                        lon: '2'
                    }
                };

                expect(mapped.place).toEqual(expectedPlace);
            });
        });

        describe('mergeObjects', function() {
            var first, second, third, firstPlace, secondPlace, thirdPlace;
            beforeEach(function() {
                firstPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_1',
                    info: 'first info',
                    label: 'Kauhajoki'
                };

                secondPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_2',
                    info: 'second info',
                    label: 'Kauhajoki'
                };

                thirdPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_3',
                    info: 'third info',
                    label: 'Kauhajoki'
                };

                first = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: firstPlace
                };

                second = {
                    id: 'http://ldf.fi/warsa/events/event_2',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: secondPlace
                };

                third = {
                    id: 'http://ldf.fi/warsa/events/event_3',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: thirdPlace
                };
            });

            it('merges two objects', function() {
                var first = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    date: 'http://ldf.fi/warsa/events/times/time_1940-02-12-1940-02-12'
                };

                var second = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    label: 'Eduskunnan viimeinen kokous Kauhajoella.',
                    date: 'http://ldf.fi/warsa/events/times/time_1940-02-12-1940-02-12'
                };

                var expected = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    label: 'Eduskunnan viimeinen kokous Kauhajoella.',
                    place: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    date: 'http://ldf.fi/warsa/events/times/time_1940-02-12-1940-02-12'
                };

                var merged = objectMapperService.mergeObjects(first, second);

                expect(merged).toEqual(expected);
            });

            it('creates a list if the objects have the same property with different values', function() {
                var first = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: 'http://ldf.fi/warsa/places/municipalities/m_place_119'
                };

                var second = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: 'http://ldf.fi/warsa/places/municipalities/m_place_1'
                };

                var expected = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: [
                        'http://ldf.fi/warsa/places/municipalities/m_place_119',
                        'http://ldf.fi/warsa/places/municipalities/m_place_1'
                    ]
                };

                var merged = objectMapperService.mergeObjects(first, second);

                expect(merged).toEqual(expected);
            });

            it('does not create duplicate values', function() {
                var obj = readJSON('test/json/simple-object.json');
                var first = objectMapperService.makeObject(obj);
                var second = objectMapperService.makeObject(obj);

                var merged = objectMapperService.mergeObjects(first, second);

                expect(merged).toBe(first);
            });

            it('handles object values', function() {
                var firstPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    label: 'Kauhajoki'
                };
                var secondPlace = {
                    id: 'other',
                    label: 'Kauhajoki'
                };

                var first = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: firstPlace
                };

                var second = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: secondPlace
                };

                var expected = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: [firstPlace, secondPlace]
                };

                var merged = objectMapperService.mergeObjects(first, second);

                expect(merged).toEqual(expected);
            });

            it('merges two object values recursively', function() {
                second.id = first.id;
                secondPlace.id = firstPlace.id;

                var expectedPlace = {
                    id: firstPlace.id,
                    info: [firstPlace.info, secondPlace.info],
                    label: firstPlace.label
                };

                var expected = {
                    id: first.id,
                    type: first.type,
                    place: expectedPlace
                };

                var merged = objectMapperService.mergeObjects(_.cloneDeep(first), _.cloneDeep(second));

                expect(merged).toEqual(expected);
            });

            it('merges object values recursively', function() {
                third.id = first.id;

                firstPlace.info = ['first info', 'second info'];
                thirdPlace.id = firstPlace.id;

                var expectedPlace = {
                    id: firstPlace.id,
                    info: ['first info', 'second info', 'third info'],
                    label: firstPlace.label
                };

                var expected = {
                    id: first.id,
                    type: first.type,
                    place: expectedPlace
                };

                var merged = objectMapperService.mergeObjects(_.cloneDeep(first), _.cloneDeep(third));

                expect(merged).toEqual(expected);
            });

            it('merges values that are lists', function() {
                second.id = first.id;

                first.place = [firstPlace, secondPlace];
                second.place = [thirdPlace];

                var expected = {
                    id: first.id,
                    type: first.type,
                    place: [firstPlace, secondPlace, thirdPlace]
                };

                var merged = objectMapperService.mergeObjects(_.cloneDeep(first), _.cloneDeep(second));

                expect(merged).toEqual(expected);
            });

            it('removes duplicates when merging lists', function() {
                second.id = first.id;

                first.place = [firstPlace, secondPlace];
                second.place = [secondPlace, thirdPlace];

                var expected = {
                    id: first.id,
                    type: first.type,
                    place: [firstPlace, secondPlace, thirdPlace]
                };

                var merged = objectMapperService.mergeObjects(_.cloneDeep(first), _.cloneDeep(second));

                expect(merged).toEqual(expected);
            });

            it('works recursively with lists', function() {
                second.id = first.id;
                secondPlace.id = firstPlace.id;
                firstPlace.info = ['first info', 'second info'];
                secondPlace.info = ['second info', 'third info'];

                var expectedPlace = {
                    id: firstPlace.id,
                    info: ['first info', 'second info', 'third info'],
                    label: firstPlace.label
                };

                var expected = {
                    id: first.id,
                    type: first.type,
                    place: expectedPlace
                };

                var merged = objectMapperService.mergeObjects(_.cloneDeep(first), _.cloneDeep(second));

                expect(merged).toEqual(expected);
            });

            it('can handle deep object values', function() {
                second.id = first.id;

                first.place = {};
                second.place = {};

                for (var i = 0; i < 10; i++) {
                    _.set(first, _.repeat('place.', i+1) + 'id', i);
                    _.set(second, _.repeat('place.', i+1) + 'id', i);
                }

                second.place.place.place = { id: 'other' };

                var expected = _.cloneDeep(first);
                expected.place.place.place = [expected.place.place.place, { id: 'other' }];

                var merged = objectMapperService.mergeObjects(first, second);

                expect(merged).toEqual(expected);
            });
        });

        describe('mergeValueToList', function() {
            var firstPlace, secondPlace, thirdPlace, first, second, third;
            beforeEach(function() {
                firstPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    info: 'first info',
                    label: 'Kauhajoki'
                };

                secondPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    info: 'second info',
                    label: 'Kauhajoki'
                };

                thirdPlace = {
                    id: 'http://ldf.fi/warsa/places/municipalities/m_place_119',
                    info: 'third info',
                    label: 'Kauhajoki'
                };
                first = {
                    id: 'http://ldf.fi/warsa/events/event_1',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: firstPlace
                };

                second = {
                    id: 'http://ldf.fi/warsa/events/event_2',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: secondPlace
                };

                third = {
                    id: 'http://ldf.fi/warsa/events/event_2',
                    type: 'http://ldf.fi/warsa/events/event_types/PoliticalActivity',
                    place: thirdPlace
                };
            });

            it('merges an object with another object in the list if they have the same id', function() {

                var expectedPlace = {
                    id: thirdPlace.id,
                    info: ['second info', 'third info'],
                    label: thirdPlace.label
                };

                var expected = [
                    first,
                    {
                        id: second.id,
                        type: second.type,
                        place: expectedPlace
                    }
                ];

                var merged = objectMapperService.mergeValueToList([_.cloneDeep(first),
                    _.cloneDeep(second)], _.cloneDeep(third));

                expect(merged).toEqual(expected);
            });

            it('appends the object to the list if no other object with the same id is found', function() {

                third.id = 'http://ldf.fi/warsa/events/event_3';

                var expected = [first, second, third];

                var merged = objectMapperService.mergeValueToList([_.cloneDeep(first),
                    _.cloneDeep(second)], _.cloneDeep(third));

                expect(merged).toEqual(expected);
            });

            it('works with non-object-mapper-object values', function() {
                var values = ['hello', 'hi'];
                var merged = objectMapperService.mergeValueToList(values, 'hola');
                var expected = ['hello', 'hi', 'hola'];

                expect(merged).toEqual(expected);

                values = ['hello', 'hi'];
                merged = objectMapperService.mergeValueToList(values, 'hello');
                expected = ['hello', 'hi'];

                expect(merged).toEqual(expected);

                values = ['hello', 'hi'];
                merged = objectMapperService.mergeValueToList(values, 'hi');
                expected = ['hello', 'hi'];

                expect(merged).toEqual(expected);

                var now = new Date();

                values = [now];
                merged = objectMapperService.mergeValueToList(values, 'hi');
                expected = [now, 'hi'];

                expect(merged).toEqual(expected);

                var later = new Date();

                values = [now, later];
                merged = objectMapperService.mergeValueToList(values, now);
                expected = [now, later];

                expect(merged).toEqual(expected);
            });

            it('does not merge objects that do not have an id attribute', function() {
                var values = [{ some: 'val', other: 'value' }, { some: 'val', something: 'other' }];
                var merged = objectMapperService.mergeValueToList(values, { new: 'obj' });
                var expected = [{ some: 'val', other: 'value' }, { some: 'val', something: 'other' }, { new: 'obj' }];

                expect(merged).toEqual(expected);

                values = [{ some: 'val', other: 'value' }, { new: 'obj' }];
                merged = objectMapperService.mergeValueToList(values, { some: 'val', something: 'other' });
                expected = [{ some: 'val', other: 'value' }, { new: 'obj' }, { some: 'val', something: 'other' }];

                expect(merged).toEqual(expected);
            });
        });

        describe('makeObjectList', function() {
            it('creates a list of objects based on SPARQL results', function() {
                var list = readJSON('test/json/simple-object-list.json');
                var expected = readJSON('test/json/expected-simple-list.json');

                var mapped = objectMapperService.makeObjectList(list);

                expect(mapped).toEqual(expected);
            });

            it('merges results if needed', function() {
                var list = readJSON('test/json/merge-list.json');
                var expected = readJSON('test/json/expected-merge-list.json');

                var mapped = objectMapperService.makeObjectList(list);

                expect(mapped).toEqual(expected);
            });
        });

    });
})();

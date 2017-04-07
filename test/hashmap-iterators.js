let o = require('../build/hashmap-iterators.js');
let assert = require('assert');

describe('factory', function() {
    it('is a function', function() {
        assert.equal(typeof o, 'function');
    });
    it('returns an object', function() {
        let instance = o({
            a: 1,
            b: 2
        });
        assert.equal(typeof instance, 'object');
    });
});

describe('iterable hashmap', function() {
    it('is an object', function() {
        let item = o({test: true});
        assert.equal(typeof item, 'object');
    });
    it('preserves original data', function() {
        let start = {
            fruit: 'apple',
            vegetable: 'carrot'
        };
        let end = o(start);
        Object.keys(start).forEach(function(key) {
            assert.equal(end[key], start[key]);
        });
    });
    let methods = [
        'sort',
        'indexOf',
        'lastIndexOf',
        'some',
        'every',
        'map',
        'filter',
        'reduce',
        'reduceRight'
    ];
    it('has additional methods', function() {
        let item = o({test: true});
        let item_properties = Object.getOwnPropertyNames(item);
        methods.forEach(function(method) {
            assert(item_properties.indexOf(method));
        });
    });
    it('declares additional methods as non-enumerable', function() {
        let item = o({test: true});
        methods.forEach(function(method) {
            assert(item.propertyIsEnumerable(method) === false);
        });
    });
});

describe('sorting', function() {
    it('defaults to lexicographic', function() {
        let item = o({
            a: 1,
            c: 3,
            b: 2,
            d: 4
        }).sort();
        let result = '';
        item.forEach(function(value) {
            result += value;
        });
        assert.equal(result, '1234');
    });
    it('accepts a comparator function', function() {
        let item = o({
            a: '1',
            b: '2',
            y: '3',
            z: '4'
        })
        .sort(function(a, b) {
            return a < b;
        });
        let first = '';
        item.forEach(function(value) {
            first += value;
        });
        item.sort(function(a, b) {
            return a > b;
        });
        let second = '';
        item.forEach(function(value) {
            second += value;
        });
        assert.notEqual(first, second);
    });
    it('is independent for each instance', function() {
        let first_result = '';
        let first = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a > b;
        });
        first
            .forEach(function(value) {
                first_result += value;
            });
        let second_result = '';
        let second = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a < b;
        });
        second
            .forEach(function(value) {
                second_result += value;
            });
        assert(first_result !== second_result);
    });
});

describe('indices', function() {
    it('finds the first index with indexOf', function() {
        let item = o({
            a: 'apple',
            b: 'pear',
            c: 'apple'
        }).sort();
        assert(item.indexOf('apple') === 'a');
    });
    it('finds the last index with lastIndexOf', function() {
        let item = o({
            a: 'apple',
            b: 'pear',
            c: 'apple'
        }).sort();
        assert(item.lastIndexOf('apple') === 'c');
    });
});

describe('array method analogues', function() {

    describe('some', function() {
        it('finds matches', function() {
            let first = o({test: true});
            let first_test = first.some(value => value === true);
            assert.equal(first_test, true);
            let second = o({test: true});
            let second_test = second.some(value => value === false);
            assert.equal(second_test, false);
        });
    });

    describe('every', function() {
        it('finds all matches', function() {
            let first = o({a: 'apple', b: 'apple'});
            let first_test = first.every(value => value === 'apple');
            assert.equal(first_test, true);
            let second = o({a: 'apple', b: 'banana'});
            let second_test = second.every(value => value === 'apple');
            assert.equal(second_test, false);
        });
    });

    describe('map', function() {
        it('transforms the input', function() {
            let start = o({a: 'y', b: 'z'});
            let end = start.map(function(value) {
                return value + value;
            });
            let test = o(end);
            let result = '';
            test.forEach(function(value) {
                result += value;
            });
            assert.equal(result, 'yyzz');
        });
    });

    describe('filter', function() {
        it('removes items', function() {
            let start = o({a: 'y', b: 'z'});
            let end = start.filter(function(value) {
                return value !== 'z';
            });
            assert.equal(Object.keys(end).length, 1);
        });
    });

    describe('forEach', function() {
        it('iterates across all items', function() {
            let item = o({a: 'y', b: 'z'});
            let result = '';
            item.forEach(function(value, key) {
                result += value + key;
            });
            assert.equal(result, 'yazb');
        });
    });

    describe('reduce', function() {
        it('reduces to a single value', function() {
            let item = o({a: 1, b: 2});
            let result = item.reduce(function(previous, value, key) {
                return previous + key + value;
            }, '0');
            assert.equal(result, '0a1b2');
        });
    });

    describe('reduceRight', function() {
        it('reduces to a single value in reverse order', function() {
            let item = o({a: 1, b: 2});
            let result = item.reduceRight(function(previous, value, key) {
                return previous + key + value;
            }, '0');
            assert.equal(result, '0b2a1');
        });
    });

});

describe('syntax', function() {
    it('allows fluent chaining', function() {
        let item = o({a: 1, b: 2, c: 3, d: 4});
        let result = '';
        item
            .filter(function(value) {
                return value % 2 === 0;
            })
            .map(function(value) {
                return value + 1;
            })
            .forEach(function(value, key) {
                result += key + value;
            });
        assert.equal(result, 'b3d5');
    });
});

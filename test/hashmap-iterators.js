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
    let iteration_methods = [
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
    it('has iteration methods', function() {
        let item = o({test: true});
        let item_properties = Object.getOwnPropertyNames(item);
        iteration_methods.forEach(function(method) {
            assert(item_properties.indexOf(method));
        });
    });
    it('declares iteration methods as non-enumerable', function() {
        let item = o({test: true});
        iteration_methods.forEach(function(method) {
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
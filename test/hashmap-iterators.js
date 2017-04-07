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
            let value = start[key];
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
        let item_properties = Object.getOwnPropertyNames(item);
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
        item.forEach(function(value, key) {
            first += value;
        });
        item.sort(function(a, b) {
            return a > b;
        });
        let second = '';
        item.forEach(function(value, key) {
            second += value;
        });
        assert.notEqual(first, second);
    });
    it('is independent for each instance', function() {
        let first = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a > b;
        })
        .join('');
        let second = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a < b;
        })
        .join('');
        assert(first !== second);
    });
});
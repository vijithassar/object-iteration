let o = require('../build/object-iteration.js');
let assert = require('assert');

let compress = function(previous, value, key) {
    if (typeof previous === 'undefined') {
        previous = '';
    }
    return previous + key + value;
};

describe('factory', function() {
    it('is a function', function() {
        assert.equal(typeof o, 'function');
    });
    it('returns an object', function() {
        let item = o({
            a: 1,
            b: 2
        });
        assert.equal(typeof item, 'object');
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
        let result = item.reduce(compress);
        assert.equal(result, 'a1b2c3d4');
    });
    it('accepts a comparator function', function() {
        let item = o({
            a: '1',
            b: '2'
        })
        .sort(function(a, b) {
            return a < b;
        });
        let first = item.reduce(compress);
        item.sort(function(a, b) {
            return a > b;
        });
        let second = item.reduce(compress);
        assert.notEqual(first, second);
    });
    it('is independent for each instance', function() {
        let first = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a > b;
        });
        let first_result = first.reduce(compress);
        let second = o({
            a: 1,
            b: 2
        })
        .sort(function(a, b) {
            return a < b;
        });
        let second_result = second.reduce(compress);
        assert.notEqual(first_result, second_result);
    });
    it('persists until later method calls', function() {
        let item = o({x: 1, y: 2, z: 3})
            .sort(function(a, b) {
                return a < b;
            });
        let result = item.reduce(compress);
        assert.equal(result, 'z3y2x1');
    });
    it('persists between chained method calls', function() {
        let item = o({x: 1, y: 2, z: 3});
        let first_order = '';
        let second_order = '';
        item
            .sort(function(a, b) {
                return a < b;
            });
        item
            .map(function(value, key) {
                first_order += value + key;
                return value;
            })
            .map(function(value, key) {
                second_order += value + key;
                return value;
            });
        assert.equal(first_order, second_order);
    });
    it('can be chained directly', function() {
        let item = o({x: 1, y: 2, z: 3});
        let result = item
            .sort(function(a, b) {
                return a < b;
            })
            .filter(function(value, key) {
                return key !== 'y';
            })
            .map(function(value) {
                return value + 1;
            })
            .reduce(compress);
        assert.equal(result, 'z4x2');
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
            let result = end.reduce(compress);
            assert.equal(result, 'ayybzz');
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
            let result = item.reduce(compress, 'z');
            assert.equal(result, 'za1b2');
        });
    });

    describe('reduceRight', function() {
        it('reduces to a single value in reverse order', function() {
            let item = o({a: 1, b: 2});
            let result = item.reduceRight(compress, 'z');
            assert.equal(result, 'zb2a1');
        });
    });

});

describe('syntax', function() {
    it('allows fluent chaining', function() {
        let item = o({a: 1, b: 2, c: 3, d: 4});
        let result = item
            .filter(function(value) {
                return value % 2 === 0;
            })
            .map(function(value) {
                return value + 1;
            })
            .reduce(compress);
        assert.equal(result, 'b3d5');
    });
});

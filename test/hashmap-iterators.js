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
        let i = o({test: true});
        assert.equal(typeof i, 'object');
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
});
var lexicographic,
    hashmap_iterators;

lexicographic = function(a, b) {
    return a > b;
};

hashmap_iterators = function(pairs) {

    var instance;

    instance = function() {

        var hashmap,
            keys,
            key,
            sort,
            comparator,
            order,
            indexOf,
            lastIndexOf,
            forEach,
            map,
            filter,
            some,
            every,
            reduce,
            reduceRight;

        hashmap = {};
        comparator = lexicographic;

        if (pairs) {
            keys = Object.keys(pairs);
        } else {
            keys = [];
        }
        order = keys.sort(comparator);

        if (pairs) {
            for (key in pairs) {
                if (pairs.hasOwnProperty(key)) {
                    hashmap[key] = pairs[key];
                }
            }
        }

        sort = function(new_comparator) {
            if (typeof new_comparator === 'function') {
                comparator = new_comparator;
                order.sort(comparator);
            }
            return hashmap;
        };
        Object.defineProperty(hashmap, 'sort', {value: sort});

        indexOf = function(target) {
            var key,
                value,
                i;
            for (i = 0; i < order.length; i++) {
                key = order[i];
                value = pairs[key];
                if (target === value) {
                    return key;
                }
            }
        };
        Object.defineProperty(hashmap, 'indexOf', {value: indexOf});

        lastIndexOf = function(target) {
            var key,
                value,
                i;
            for (i = order.length; i > -1; i--) {
                key = order[i];
                value = pairs[key];
                if (target === value) {
                    return key;
                }
            }
        };
        Object.defineProperty(hashmap, 'lastIndexOf', {value: lastIndexOf});

        forEach = function(callback) {
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                callback(value, key);
            });
        };
        Object.defineProperty(hashmap, 'forEach', {value: forEach});

        map = function(callback) {
            var result;
            result = {};
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                result[key] = callback(value, key);
            });
            return result;
        };
        Object.defineProperty(hashmap, 'map', {value: map});

        filter = function(callback) {
            var result;
            result = {};
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                if (callback(value, key)) {
                    result[key] = value;
                }
            });
            return result;
        };
        Object.defineProperty(hashmap, 'filter', {value: filter});

        some = function(callback) {
            var result;
            result = false;
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                if (callback(value, key)) {
                    result = true;
                }
            });
            return result;
        };
        Object.defineProperty(hashmap, 'some', {value: some});

        every = function(callback) {
            var result;
            result = true;
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                if (! callback(value, key)) {
                    result = false;
                }
            });
            return result;
        };
        Object.defineProperty(hashmap, 'every', {value: every});

        reduce = function(accumulator, initial_value) {
            var reduced;
            reduced = order.reduce(function(previous_result, key) {
                var value;
                value = pairs[key];
                return accumulator(previous_result, value, key);
            }, initial_value);
            return reduced;
        };
        Object.defineProperty(hashmap, 'reduce', {value: reduce});

        reduceRight = function(accumulator, initial_value) {
            var reduced;
            reduced = order.reduceRight(function(previous_result, key) {
                var value;
                value = pairs[key];
                return accumulator(previous_result, value, key);
            }, initial_value);
            return reduced;
        };
        Object.defineProperty(hashmap, 'reduceRight', {value: reduceRight});


        return hashmap;

    };

    return instance();

};

export { hashmap_iterators };
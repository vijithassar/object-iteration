var create_comparator,
    lexicographic,
    indexOf,
    lastIndexOf,
    forEach,
    map,
    filter,
    some,
    every,
    reduce,
    reduceRight,
    object_iteration;

// given an array, create a comparator function that will
// sort items based on their position in that array
create_comparator = function(order) {
    var comparator;
    comparator = function(a, b) {
        return order.indexOf(a) - order.indexOf(b);
    };
    return comparator;
};

// default lexicographic sort comparator function
lexicographic = function(a, b) {
    return a > b ? 1 : -1;
};

indexOf = function(target, pairs, order) {
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

lastIndexOf = function(target, pairs, order) {
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

forEach = function(callback, pairs, order) {
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        callback(value, key);
    });
};

map = function(callback, pairs, order) {
    var result;
    result = {};
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        result[key] = callback(value, key);
    });
    return object_iteration(result).sort(create_comparator(order));
};

filter = function(callback, pairs, order) {
    var result;
    result = {};
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        if (callback(value, key)) {
            result[key] = value;
        }
    });
    return object_iteration(result).sort(create_comparator(order));
};

some = function(callback, pairs, order) {
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

every = function(callback, pairs, order) {
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

reduce = function(accumulator, initial_value, pairs, order) {
    var reduced;
    reduced = order.reduce(function(previous_result, key) {
        var value;
        value = pairs[key];
        return accumulator(previous_result, value, key);
    }, initial_value);
    return reduced;
};

reduceRight = function(accumulator, initial_value, pairs, order) {
    var reduced;
    reduced = order.reduceRight(function(previous_result, key) {
        var value;
        value = pairs[key];
        return accumulator(previous_result, value, key);
    }, initial_value);
    return reduced;
};

object_iteration = function(pairs) {

    var factory,
        instance;

    // generate with a factory to isolate
    // scoped variables for each instance
    factory = function() {

        var object,
            keys,
            key,
            sort,
            comparator,
            order,
            _indexOf,
            _lastIndexOf,
            _forEach,
            _map,
            _filter,
            _some,
            _every,
            _reduce,
            _reduceRight;

        comparator = lexicographic;
        object = {};

        // establish a default sort and iteration order
        if (pairs) {
            keys = Object.keys(pairs);
        } else {
            keys = [];
        }
        order = keys.sort(comparator);

        // copy input pairs to the new object
        if (pairs) {
            for (key in pairs) {
                if (pairs.hasOwnProperty(key)) {
                    object[key] = pairs[key];
                }
            }
        }

        // create curried aliases for each function defined
        // outside the factory scope which can then be bound
        // with Object.defineProperty

        _indexOf = function(target) {
            return indexOf(target, pairs, order);
        };
        Object.defineProperty(object, 'indexOf', {value: _indexOf});

        _lastIndexOf = function(target) {
            return lastIndexOf(target, pairs, order);
        };
        Object.defineProperty(object, 'lastIndexOf', {value: _lastIndexOf});

        _forEach = function(callback) {
            forEach(callback, pairs, order);
        };
        Object.defineProperty(object, 'forEach', {value: _forEach});

        _map = function(callback) {
            return map(callback, pairs, order);
        };
        Object.defineProperty(object, 'map', {value: _map});

        _filter = function(callback) {
            return filter(callback, pairs, order);
        };
        Object.defineProperty(object, 'filter', {value: _filter});

        _some = function(callback) {
            return some(callback, pairs, order);
        };
        Object.defineProperty(object, 'some', {value: _some});

        _every = function(callback) {
            return every(callback, pairs, order);
        };
        Object.defineProperty(object, 'every', {value: _every});

        _reduce = function(accumulator, initial_value) {
            return reduce(accumulator, initial_value, pairs, order);
        };
        Object.defineProperty(object, 'reduce', {value: _reduce});

        _reduceRight = function(accumulator, initial_value) {
            return reduceRight(accumulator, initial_value, pairs, order);
        };
        Object.defineProperty(object, 'reduceRight', {value: _reduceRight});

        // accept a new comparator function and re-sort
        sort = function(new_comparator) {
            if (typeof new_comparator === 'function') {
                comparator = new_comparator;
            }
            order = keys.sort(comparator);
            return object;
        };
        Object.defineProperty(object, 'sort', {value: sort});

        return object;

    };

    // return an instance

    instance = factory();

    return instance;

};

export { object_iteration };
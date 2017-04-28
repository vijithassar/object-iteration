var lexicographic,
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

forEach = function(callback, context, original, pairs, order) {
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        callback.call(context, value, key, original);
    });
};

map = function(callback, context, original, comparator, pairs, order) {
    var result;
    result = {};
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        result[key] = callback.call(context, value, key, original);
    });
    return object_iteration(result).sort(comparator);
};

filter = function(callback, context, original, comparator, pairs, order) {
    var result;
    result = {};
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        if (callback.call(context, value, key, original)) {
            result[key] = value;
        }
    });
    return object_iteration(result).sort(comparator);
};

some = function(callback, context, original, pairs, order) {
    var result;
    result = false;
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        if (callback.call(context, value, key, original)) {
            result = true;
        }
    });
    return result;
};

every = function(callback, context, original, pairs, order) {
    var result;
    result = true;
    order.forEach(function(key) {
        var value;
        value = pairs[key];
        if (! callback.call(context, value, key, original)) {
            result = false;
        }
    });
    return result;
};

reduce = function(accumulator, initial_value, original, pairs, order) {
    var reduced;
    reduced = order.reduce(function(previous_result, key) {
        var value;
        value = pairs[key];
        return accumulator(previous_result, value, key, original);
    }, initial_value);
    return reduced;
};

reduceRight = function(accumulator, initial_value, original, pairs, order) {
    var reduced;
    reduced = order.reduceRight(function(previous_result, key) {
        var value;
        value = pairs[key];
        return accumulator(previous_result, value, key, original);
    }, initial_value);
    return reduced;
};

object_iteration = function(pairs) {

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

    _forEach = function(callback, context) {
        if (arguments.length === 1) {
            context = this;
        }
        forEach(callback, context, object, pairs, order);
    };
    Object.defineProperty(object, 'forEach', {value: _forEach});

    _map = function(callback, context) {
        if (arguments.length === 1) {
            context = this;
        }
        return map(callback, context, object, comparator, pairs, order);
    };
    Object.defineProperty(object, 'map', {value: _map});

    _filter = function(callback, context) {
        if (arguments.length === 1) {
            context = this;
        }
        return filter(callback, context, object, comparator, pairs, order);
    };
    Object.defineProperty(object, 'filter', {value: _filter});

    _some = function(callback, context) {
        if (arguments.length === 1) {
            context = this;
        }
        return some(callback, context, object, pairs, order);
    };
    Object.defineProperty(object, 'some', {value: _some});

    _every = function(callback, context) {
        if (arguments.length === 1) {
            context = this;
        }
        return every(callback, context, object, pairs, order);
    };
    Object.defineProperty(object, 'every', {value: _every});

    _reduce = function(accumulator, initial_value) {
        return reduce(accumulator, initial_value, object, pairs, order);
    };
    Object.defineProperty(object, 'reduce', {value: _reduce});

    _reduceRight = function(accumulator, initial_value) {
        return reduceRight(accumulator, initial_value, object, pairs, order);
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

export { object_iteration };
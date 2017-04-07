var lexicographic,
    hashmap_iterators;

lexicographic = function(a, b)  {
  return a > b;
}

hashmap_iterators = function(pairs) {
  
    var instance;
    
    instance = function() {
      
        var hash,
            keys,
            sort,
            comparator,
            order,
            internal_configuration,
            indexOf,
            lastIndexOf,
            forEach,
            map,
            filter,
            some,
            every;
  
        hash = {};
        comparator = lexicographic;
      
        if (pairs) {
            keys = Object.keys(pairs);
        } else {
            keys = [];
        }
        order = keys.sort(comparator);
        
        if (pairs) {
            for (var key in pairs) {
                if (pairs.hasOwnProperty(key)) {
                    hash[key] = pairs[key];
                }
            }
        }

        sort = function(new_comparator) {
            if (typeof new_comparator === 'function') {
                comparator = new_comparator;
                order.sort(comparator);
            }
        };
        
        indexOf = function(target) {
            var result;
            for (var i = 0; i < order.length; i++) {
                var key,
                    value;
                key = order[i];
                value = pairs[key];
                if (target === value) {
                    return key;
                }
            }
        };
        Object.defineProperty(hash, 'indexOf', {value: indexOf});
        
        lastIndexOf = function(target) {
            var result;
            for (var i = order.length; i > -1; i--) {
                var key,
                    value;
                key = order[i];
                value = pairs[key];
                if (target === value) {
                    return key;
                }
            }
        };
        Object.defineProperty(hash, 'lastIndexOf', {value: lastIndexOf});
      
        forEach = function(callback) {
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                callback(value, key);
            })
        }
        Object.defineProperty(hash, 'forEach', {value: forEach});
      
        map = function(callback) {
            var result;
            result = better_hash(internal_configuration);
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                result[key] = callback(value, key);
            });
            return result;
        }
        Object.defineProperty(hash, 'map', {value: map});
        
        filter = function(callback) {
            var result;
            result = better_hash(internal_configuration);
            order.forEach(function(key) {
                var value;
                value = pairs[key];
                if (callback(value, key)) {
                    result[key] = value;
                }
            })
            return result;
        };
        Object.defineProperty(hash, 'filter', {value: filter});
        
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
        }
        Object.defineProperty(hash, 'some', {value: some});
        
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
        }
        Object.defineProperty(hash, 'every', {value: every});
        
        return hash;
        
    }
    
    return instance();

};

export { hashmap_iterators };
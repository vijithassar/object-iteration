# Object Iteration

reimplementing the [ES5 array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Iteration_methods) for use with plain old JavaScript objects

## Quick Start

**TL;DR**: Pass objects with key-value pairs through the function to extend them with new methods which are almost exactly the same as the ES5 array methods. The only difference is that every callback takes `value` and `key` as parameters, where `key` is a *string* instead of an *integer* as with arrays. The default iteration order is lexicographic until another sort comparator function is specified.

## Overview

### What

The ES5 array iteration methods are elegant and powerful, but they only work for arrays; hashmaps are out of luck. JavaScript makes no promises about the order when you iterate across the properties of an object, so it's hard to get meaningful behavior out of order-sensitive concepts like `forEach` and `reduce` when a deterministic order does not exist. This tool adds a small and largely invisible wrapper around plain old JavaScript objects which enforces a stable iteration order, and then it uses that stable order to create equivalents for all your favorite array methods, like `map`, `filter`, and `reduce`.

### Why

List-based functional programming favors a paradigm where a *large variety of functions* operate on a *small variety of data structures* which all implement a consistent interface. This module is an attempt to extend the power of iteration methods from arrays to also include key-value pairs by *re-implementing the ES5 array method interface*.

Plenty of other iteration tools and libraries exist for use with objects and hashmaps, but most are idiosyncratic or require specialized instantiation. This tool strives to be generic: it is **minimally invasive**, can **extend any arbitrary object**, reimplements **all ES5 iteration methods** and **exactly matches the existing APIs**.

### How

Extending an object with iteration methods creates a closure which is used to store an array of the object's enumerable properties. Iteration order is determined from sorting the enumerable properties, either lexicographically or with an optional custom comparator function. Hidden non-enumerable methods are added to the object with APIs that exactly match the ES5 array methods, except that the property `key` (typically a *string*) is substituted for the array `index` (always an *integer*). This one obvious distinction aside, the behavior is consistent, because the original ES5 array iteration methods are still used under the hood, applied internally to the result of `Object.keys().sort()`.

## Using

### Installation

Clone this repository, or install from npm:

```bash
# install object iteration package
$ npm install object-iteration
```

The source code is an ES6 module, usable directly via `package.module`. The compiled build is a UMD module which will work either as a CommonJS module with `require()` or as a standalone script tag.

```javascript
// ES6 import
import { 'object_iteration' } from './object-iteration.js';
```

```javascript
// use require() for Node or other CommonJS loaders
let object_iteration = require('object-iteration');
```

```html
<!-- include directly on page -->
<script type="text/javascript" src="path/to/object-iteration.js"></script>
```

### Syntax

I've taken to storing this function in a variable called `o`, and use that convention in the documentation below. The letter semantically fits with the concept of extending an **object**, and it is also **short** and **symmetrical**. That visual balance means that using it inline still feels roughly comparable to a regular object literal.

To import or require in this manner:

```javascript
// CommonJS require with o alias
let o = require('object-iteration');

// OR

// ES6 import with o binding
import { object_iteration as o } from './object-iteration.js';
```

In use:

```javascript
// wrap the object literal in the function to extend
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
});

// your key-value pairs now have iteration methods
pairs
    .filter(function(value, key) {
        // ...
    })
    .map(function(value, key) {
        // ...
    })
    .reduce(function(previous, value, key) {
        // ...
    });
```

## API

### Sorting

By default, sorting is lexicographic/alphabetical by property name:

```javascript
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
});
// lexicographic sort by default
pairs.forEach(function(value, key) {
    console.log(key + ':' + value)
});
/*
prints:

'animal:dog'
'mineral:diamond'
'vegetable:carrot'
*/
```

As with arrays, you can provide your own comparator function to change the sort order:

```javascript
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
}).sort(function(a, b) {
    // reverse alphabetical order by property name
    return a > b;
});
pairs.forEach(function(value, key) {
    console.log(key + ':' + value)
});
/*
prints:

'vegetable:carrot'
'mineral:diamond'
'animal:dog'
*/
```

### Iteration Methods

All ES5 array iteration methods are reimplemented. The parameters taken by the callback functions are exactly the same as with the original array methods, except that the object's *string* `key` will be used instead of the array method's *integer* `index`.

- `forEach` iterates across the object and runs a callback function on each key-value pair
- `map` returns a new iterable object with the values transformed by the callback function (keys are unchanged)
- `filter` returns a new iterable object containing only key-value pairs in which the predicate function returns true
- `some` returns a boolean `true` if *any* key-value pairs in the object evaluate to `true` given the specified predicate function, otherwise returns `false`
- `every` returns a boolean `true` if *all* key-value pairs in the object evaluate to `true` given the specified predicate function, otherwise returns `false`
- `reduce` reduces an object to a single value with an accumulator function
- `reduceRight` reduces an object to a single value with an accumulator function, iterating in reverse order

For more detailed information about the behavior of these methods, consult [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Iteration_methods).

### Index Methods

Index lookup methods like `indexOf` and `lastIndexOf` don't mean anything in an ordinary hashmap where the iteration order is unstable, but they *do* have meaning once the keys have a consistent order, so they are reimplemented:

```javascript
// lexicographic sort by default
let pairs = o({
    animal2: 'dog',
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
});
console.log(pairs.indexOf('dog')); // prints 'animal'
console.log(pairs.lastIndexOf('dog')); // prints 'animal2'
```

## Shared Functions

The APIs for the iteration methods **exactly match** the original array implementations. As a result, in many cases your callback, accumulator, and predicate functions can be *reused verbatim* with both arrays and hashmaps.

```javascript
// expand an array or object into a readable phrase
let phrase = function(value, index) {
    return index + "'s favorite food is " + value;
};

let numbers = ['pizza', 'spaghetti', 'chocolate'];
let numbers_phrases = numbers.map(phrase);
/*
numbers_phrases result:
[
    "0's favorite food is pizza",
    "1's favorite food is spaghetti",
    "2's favorite food is chocolate"
]
*/

let names = o({Jane: 'ice cream', John: 'chicken tikka masala'})
let names_phrases = names.map(phrase);
/*
names_phrases result:
[
    "Jane's favorite food is ice cream",
    "John's favorite food is chicken tikka masala"
]
*/
```

### Composing Higher Order Functions

In cases where there are slight differences in the way you need to address integer indices versus string keys, you can [compose higher-order functions](https://www.sitepoint.com/higher-order-functions-javascript/): put most of your logic in a shared iteration function, and address the differences through a composition.

For example, to extend the `phrase()` function as defined above with additional contextual language:

```javascript
// wrap the result of the input function
// in contextually appropriate text
let contextualize = function(fn) {
    let composition = function(value, index) {
        // switch text content based on the
        // type of the index parameter
        if (typeof index === 'string') {
            return 'My friend ' + fn(value, index) + '!';
        } else if (typeof index === 'number') {
            return 'Test subject #' + fn(value, index) + '.';
        }
    };
    // return a new function with the desired behavior
    return composition;
};
// compose a function for generating contextually appropriate sentences
let sentence = contextualize(phrase);
// map with the composed sentence function
let numbers_sentences = numbers.map(sentence);
let names_sentences = names.map(sentence);
/*
numbers_sentences result:
[
    "Test subject #0's favorite food is pizza.",
    "Test subject #1's favorite food is spaghetti.",
    "Test subject #2's favorite food is chocolate."
]

names_sentences result:
[
    "My friend Jane's favorite food is ice cream!",
    "My friend John's favorite food is chicken tikka masala!"
]
*/
```

## Nope

- This will not help you with iteration via imperative loops such as `for-in` or ES6 `for-of`, which do not call a method and thus will still happen in an arbitrary and unpredictable order. Consider using `forEach` for those scenarios instead.
- Objects are cloned superficially and probably won't replicate elaborate prototype chains, but feel free to try whatever crazy scheme you have in mind.
- It would be easy enough to track the iteration index and provide it as a third parameter to the callback function, but it seems more conceptually useful to *exactly match* the function signature of the array methods being imitated. If you need the iteration count as an integer in addition to the key as a string, just initialize a counter outside the scope of the callback function:

```javascript
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond',
});
// initialize counter
let index = 0;
pairs.forEach(function(value, key) {
    console.log('index ' + index + ' - ' + key + ':' + value);
    // increment counter
    index++;
});
/*
prints:

'index 0 - animal:dog'
'index 1 - mineral:diamond'
'index 2 - vegetable:carrot'
*/
```

![o-face](https://cloud.githubusercontent.com/assets/3488572/25469491/798fbb56-2aea-11e7-9643-deb6f10d0457.png)

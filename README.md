# Object Iteration

reimplementing JavaScript's [ES5 array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Iteration_methods) for use with plain objects

## Quick Start

**TL;DR**: Pass objects through the function to extend with useful methods inspired by arrays. These new object iteration methods are exactly the same as the ES5 array methods, but every callback takes `value` and `key` as parameters (so, string `key` instead of integer `index`). Default iteration order is lexicographic, or you can provide your own sort comparison function.

## Overview

The ES5 array iteration methods are wonderful and powerful, but they only work for arrays; hashmaps are out of luck. JavaScript makes no promises about the order when you iterate across the properties of an object, and it's hard to get meaningful behavior out of concepts like `forEach` and `reduce` when you do not have a stable order.

This tool adds a small and largely invisible wrapper to your plain JavaScript objects which enforces a stable iteration order, and then uses that order to build equivalents for all your favorite array methods, like `map`, `filter`, and `reduce`.

## Why

List-based functional programming favors a paradigm where a *large variety of functions* can all work on a *small variety of data structures* which all implement consistent interfaces. This is an attempt to extend the power of iteration methods from arrays to also include key-value pairs.

Plenty of other iteration tools and libraries exist for use with objects and hashmaps, but most are idiosyncratic or require specialized instantiation. This tool strives to be generic: it is **minimally invasive**, can **extend any arbitrary object**, reimplements **all ES5 iteration methods** and **exactly matches the existing APIs**.

## How

The wrapper function creates a closure which is used to store an array of the object's enumerable properties, as determined by `Object.keys()`. Hidden non-enumerable methods are then added to the object with APIs that match the ES5 array methods, except that the property `key` (a string) is substituted for the array `index` (an integer). For the most part, the original array iteration methods are used under the hood, applied internally to the result of `Object.keys().sort()`, so behavior should mostly be consistent with the original ES5 array methods.

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
import { 'object-iteration' } from './object-iteration.js';
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

I've taken to storing this function in a variable called `o`, including in the documentation below. The letter semantically fits with the concept of extending an **object**, and it is also **short** and **symmetrical**. I find that this visual balance means that using it inline still feels roughly comparable to a regular object literal.

To import or require:

```javascript
// CommonJS require with o alias
let o = require('object-iteration');

// OR

// ES6 import with o binding
import { 'object_iteration' as o } from './object-iteration.js';
```

In use:

```javascript
// a regular object literal, for which
// iterating is a pain
let pairs = {
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
};

// wrap the object literal in the function,
// which has been aliased to the letter o,
// and now you can use iteration methods
let iterable_pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
});
```

It looks so adorable, hee hee! But I mean, do whatever you want.

## API

### Sorting

Stable sorting is a prerequisite for useful iteration. Any object passed through the wrapper function will then have consistent iteration available.

By default, sorting is lexicographic/alphabetical by property name:

```javascript
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond'
});
// always alphabetical by default
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

As with arrays, you can provide your own comparison function to change the sort order, and sorting is applied separately to each item:

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

### Iteration

All ES5 array iteration methods are reimplemented:

- `forEach` iterates across the object
- `map` returns a new object with the values transformed by the callback function
- `filter` returns a new object containing only key/value pairs in which the predicate function returns true
- `reduce` reduces an object to a single value
- `reduceRight` reduces object to a single value, iterating in reverse order

The parameters taken by the callback functions (or accumulator functions, in the case of `reduce` and `reduceRight`) are exactly the same, except that the string `key` is substituted for the integer `index` (usually this is the second parameter).

### Searching

Index lookup methods like `indexOf` and `lastIndexOf` don't mean anything when the iteration order is unstable, but they *do* have meaning once the keys have a consistent order, so they are reimplemented:

```javascript
// with default lexicographic search
let pairs = o({
    animal: 'dog',
    vegetable: 'carrot',
    mineral: 'diamond',
    animal2: 'dog'
});
console.log(pairs.indexOf('dog')); // prints 'animal'
console.log(pairs.lastIndexOf('dog')); // prints 'animal2'
```

## Shared Functions

Because the APIs for the callback and accumulator functions matches the original ES5 array implementations, you can *literally use the same functions* with both arrays and hashmaps.

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
    "1's favorite food is pizza",
    "2's favorite food is spaghetti",
    "3's favorite food is chocolate"
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
    "Test subject #1's favorite food is pizza.",
    "Test subject #2's favorite food is spaghetti.",
    "Test subject #3's favorite food is chocolate."
]

names_sentences result:
[
    "My friend Jane's favorite food is ice cream!",
    "My friend John's favorite food is chicken tikka masala!"
]
*/
```

## Nope

- This will not help you with iteration via imperative loops such as `for-in` or ES6 `for-of`, which will still happen in an arbitrary order. Consider using `forEach` for those scenarios instead.
- Objects are cloned superficially and probably won't replicate elaborate prototype chains, but feel free to try whatever crazy scheme you have in mind.
- It would be easy enough to track the iteration index and provide it as a third parameter to callback function, but it seems more conceptually useful to *exactly match* the function signature of the array methods being imitated. If you need the iteration number as an integer in addition to the property name as a string, just initialize a count variable outside the callback scope:

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
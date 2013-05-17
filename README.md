# scriptie-talkie [![build status](https://secure.travis-ci.org/thlorenz/scriptie-talkie.png)](http://travis-ci.org/thlorenz/scriptie-talkie?branch=master) 

Makes your code tell you what the intermediate results are when executing a script.

***[try it in the browser](http://thlorenz.github.io/scriptie-talkie/)***

```js
var a = 3;

a = a + 1;
a++;

var b = 2;
b = b + a;
```

![changing-var](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/changing-var.png)

## Installation

    npm install scriptie-talkie

(Add `-g` to install as global command line tool)

## Command Line Tool

### scriptie-talkie a file

    scriptie-talkie path/to/script.js

Prints the highlighted code of `script.js` with intermediate results.

### piping into scriptie-talkie

    curl https://raw.github.com/thlorenz/ansicolors/master/ansicolors.js | scriptie-talkie

Prints the highlighted code of `ansicolors.js` with intermediate results.

Note that in this case `require` statements cannot be resolved.

## API

### scriptie-talkie(script, scriptPath, opts)

```
/**
 * Evaluates all snippets in the given script and calls opts.write with the result.
 * 
 * @name exports
 * @function
 * @param script {String} The String to evaluate.
 * @param scriptPath {String} The path to the script (important to resolve require statements)
 * @param opts {Object} { 
 *    toLines: function(code:String) -> [String] - to split script into lines -- uses cardinal syntax highlighter by default
 *    write  : function(result:String) - to be called to write the result -- default console.log
 *    diff   : { joinLinesAt: at what point is diff compacted to one line               -- default 20
 *             , maxLineLength: at which length is a diff line cut of with an ellipsis  -- default 380
 *             }
 */
 ```

```js
var talk    =  require('scriptie-talkie')
  , fs      =  require('fs');
  ,  script =  fs.readFileSync(scriptPath, 'utf-8');

talk(script, scriptPath, { write: console.error, { diff: { joinLinesAt: 80 } });
```

### browser support

scriptie-talkie does work in the browser as long as a `vm` and `Buffer` module is available. Additionally the presence
of a `process` with `process.browser = true` is essential.

The easiest way to build an application that uses sciptie-talkie via
[browserify](https://github.com/substack/node-browserify) as I did in [this
example](https://github.com/thlorenz/scriptie-talkie/tree/master/examples/browser). The above mentioned [live
sample](http://thlorenz.github.io/scriptie-talkie/) was built like that.

## Roadmap

- integrate with [replpad](https://github.com/thlorenz/replpad)

## More Examples

```js
var o = { a: 1 };

o.a = 2;
```
![objects-simple](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/objects-simple.png)

```js
var a = 3;

a + b;

var b = 2;

console.log(b.hello());
```
![error](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/error.png)

```js
var a = 1;
foo();

function foo () {
  return a++;
}
foo() + 1;
```
![function-call-before-declaration.png](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/function-call-before-declaration.png)

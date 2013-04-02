# scriptie-talkie [![build status](https://secure.travis-ci.org/thlorenz/scriptie-talkie.png)](http://travis-ci.org/thlorenz/scriptie-talkie)

Makes your code tell you what the intermediate results are when executing a script.

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

    scriptie-talkie path/to/script.js

Prints the highlighted code of `script.js` with intermediate results.

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
 */
 ```

```js
var script = fs.readFileSync(scriptPath, 'utf-8');
talk(script, scriptPath, { write: console.error });
```

## Roadmap

- version that works in the browser
- integrate with [replpad](https://github.com/thlorenz/replpad)

## More Examples

![objects-simple](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/objects-simple.png)
![error](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/error.png)
![function-call-before-declaration.png](https://raw.github.com/thlorenz/scriptie-talkie/master/assets/function-call-before-declaration.png)

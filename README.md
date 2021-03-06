# dingu

dingu is an angularjs-style dependency injection framework for JavaScript 
that makes it easy to define modules, singletons and constants. All dependencies
are resolved on demand, freeing you from loading your code in any particular
order.

## Features

* Bring in dependencies simply by naming them as a function parameter
* Load your javascript files in any arbitrary order
* Store singleton instances
* Store constant values like settings and magic numbers
* Protects against circular dependencies
* Can be locked to prevent further changes at runtime.

## How It Works

*Example 1: ModuleA depends on ModuleB*

```javascript
dingu.module('ModuleA', function(ModuleB) {
  return {
    doSomething: function() {
      return 'Hi from ModuleA (' + ModuleB.doSomething() + ')';
    }
  };
});

dingu.module('ModuleB', function() {
  return {
    doSomething: function() {
      return 'Hi from ModuleB';
    }
  };
});
```

Next we'll ask dingu for an instance of ModuleA and call the doSomething method.

```javascript
var a = dingu.get('ModuleA');
console.log(a.doSomething());
```

*Example 2: Using Singletons*

dingu lets you define a module that will only initialise once, and always
return the same instance back. Any dependencies it needs will be resolved
and injected the first time it's created.

```javascript
dingu.singleton('OneOnly', function() {
  var counter = 0;
  return {
    nextID: function() {
      counter += 1;
      return counter;
    }
  }
});

console.log(dingu.get('OneOnly').nextID() === 1); // true
console.log(dingu.get('OneOnly').nextID() === 2); // true
 ```

*Example 3: Storing Constant Values*

Use dingu to store settings, magic numbers and other common values and
include them in your modules by name.

```javascript
// Store a string
dingu.value('apiUrl', 'http://foo.com/api');

// or an object - dingu isn't fussy
dingu.value('systemInfo', {
  apiVersion: '1.2',
  token: 'aab23510' 
});

// And then have them ready in your module
dingu.module('apiClient', function(apiUrl, systemInfo) {
  // profit!
});
```

## Download and Install
There are many ways to get dingu:
* Grab the latest release from the [Github Release page](https://github.com/rncode/Dingu/releases)
* Download [dingu.js](https://raw.githubusercontent.com/rncode/Dingu/master/dist/dingu.js)

## Project Information

Maintainers:
* Luke Venediger - <a href="mailto:lukev@lukev.net">lukev@lukev.net</a>
* Richard Niemand - <a href="mailto:niemand.richard@gmail.com">niemand.richard@gmail.com</a>

License:
* MIT
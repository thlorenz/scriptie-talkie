'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/object-isolation-00.js', 'utf-8')

test('\n# object isolation\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/object-isolation-00', { writeln: writeln });

  if (process.browser) {
    // browser lists changes slightly differently 
    // i.e. if I update foo which is attached to o it only shows changes to foo
    //      if I update it via o.foo it shows those changes to o.foo, but not foo
    //      this is acceptable however
    t.deepEqual(
        lines
      , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfoo\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\u001b[32m,\u001b[39m \u001b[37mbar\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m \u001b[33m}\u001b[39m \u001b[33m}\u001b[39m \u001b[90m// + o: { foo: {}, bar: {} }\u001b[39m',
          '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "foo" : {\n  },\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "bar" : {\n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m2:   \u001b[32m,\u001b[39m \u001b[37mfoo\u001b[39m \u001b[93m=\u001b[39m \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m               \u001b[90m// + foo: {}\u001b[39m',
          '\u001b[92m+\u001b[39m  foo: {\n}\n',
          '\u001b[90m3:   \u001b[32m,\u001b[39m \u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m              \u001b[90m// + bar: {}\u001b[39m',
          '\u001b[92m+\u001b[39m  bar: {\n}\n',
          '\u001b[90m4:   ',
          '\u001b[90m5: \u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfirst\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foo\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mlast\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'oof\'\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  foo: {\u001b[32m\u001b[1m\n  "name" : {\n    "first" : "foo", \n    "last" : "oof" \n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "first" : "foo",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "last" : "oof"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m6: \u001b[37mbar\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfirst\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'bar\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mlast\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'oof\'\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  bar: {\u001b[32m\u001b[1m\n  "name" : {\n    "first" : "bar", \n    "last" : "oof" \n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "first" : "bar",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "last" : "oof"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m7: ',
          '\u001b[90m8: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37maddress\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mcity\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foo-city\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mstreet\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foobiloo street\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mnumber\u001b[39m\u001b[93m:\u001b[39m \u001b[34m3\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  o: {\n  "foo" : {\u001b[32m\u001b[1m\n    "address" : {\n      "city" : "foo-city", \n      "street" : "foobiloo street", \n      "number" : 3 \n    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n  },\n  "bar" : {\n  }\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "city" : "foo-city",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "street" : "foobiloo street",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "number" : 3\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n' ] 
    )
  } else {

    t.deepEqual(
        lines
      , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfoo\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\u001b[32m,\u001b[39m \u001b[37mbar\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m \u001b[33m}\u001b[39m \u001b[33m}\u001b[39m \u001b[90m// + o: { foo: {}, bar: {} }\u001b[39m',
          '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "foo" : {\n  },\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "bar" : {\n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m2:   \u001b[32m,\u001b[39m \u001b[37mfoo\u001b[39m \u001b[93m=\u001b[39m \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m               \u001b[90m// + foo: {}\u001b[39m',
          '\u001b[92m+\u001b[39m  foo: {\n}\n',
          '\u001b[90m3:   \u001b[32m,\u001b[39m \u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m              \u001b[90m// + bar: {}\u001b[39m',
          '\u001b[92m+\u001b[39m  bar: {\n}\n',
          '\u001b[90m4:   ',
          '\u001b[90m5: \u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfirst\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foo\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mlast\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'oof\'\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  o: {\n  "foo" : {\u001b[32m\u001b[1m\n    "name" : {\n      "first" : "foo", \n      "last" : "oof" \n    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n  },\n  "bar" : {\n  }\n}\u001b[90m\n--------\n\u001b[39m\u001b[94m~\u001b[39m  foo: {\u001b[32m\u001b[1m\n  "name" : {\n    "first" : "foo", \n    "last" : "oof" \n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "first" : "foo",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "last" : "oof"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m6: \u001b[37mbar\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfirst\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'bar\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mlast\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'oof\'\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  o: {\n  "foo" : {\n    "name" : {\n      "first" : "foo",\n      "last" : "oof"\n    }\n  },\n  "bar" : {\u001b[32m\u001b[1m\n    "name" : {\n      "first" : "bar", \n      "last" : "oof" \n    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n  }\n}\u001b[90m\n--------\n\u001b[39m\u001b[94m~\u001b[39m  bar: {\u001b[32m\u001b[1m\n  "name" : {\n    "first" : "bar", \n    "last" : "oof" \n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "first" : "bar",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "last" : "oof"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
          '\u001b[90m7: ',
          '\u001b[90m8: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37maddress\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mcity\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foo-city\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mstreet\u001b[39m\u001b[93m:\u001b[39m \u001b[92m\'foobiloo street\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mnumber\u001b[39m\u001b[93m:\u001b[39m \u001b[34m3\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
          '\u001b[94m~\u001b[39m  o: {\n  "foo" : {\n    "name" : {\n      "first" : "foo",\n      "last" : "oof"\n    },\u001b[32m\u001b[1m\n    "address" : {\n      "city" : "foo-city", \n      "street" : "foobiloo street", \n      "number" : 3 \n    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n  },\n  "bar" : {\n    "name" : {\n      "first" : "bar",\n      "last" : "oof"\n    }\n  }\n}\u001b[90m\n--------\n\u001b[39m\u001b[94m~\u001b[39m  foo: {\n  "name" : {\n    "first" : "foo",\n    "last" : "oof"\n  },\u001b[32m\u001b[1m\n  "address" : {\n    "city" : "foo-city", \n    "street" : "foobiloo street", \n    "number" : 3 \n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "city" : "foo-city",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "street" : "foobiloo street",\u001b[0m\u001b[36m\u001b[1m \u001b[0m\u001b[32m\u001b[1m\n  "number" : 3\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n' ]
    )
  }
  t.end()
})

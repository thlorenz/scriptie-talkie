var o = { foo: {}, bar: { } } // + o: { foo: {}, bar: {} }
  , foo = o.foo               // + foo: {}
  , bar = o.bar;              // + bar: {}
  
foo.name = { first: 'foo', last: 'oof' };
bar.name = { first: 'bar', last: 'oof' };

o.foo.address = { city: 'foo-city', street: 'foobiloo street', number: 3 };

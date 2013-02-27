var o = { foo: {}, bar: { } }
  , foo = o.foo
  , bar = o.bar;

foo.name = { first: 'foo', last: 'oof' };
bar.name = { first: 'bar', last: 'oof' };

o.foo.address = { city: 'foo-city', street: 'foobiloo street', number: 3 };

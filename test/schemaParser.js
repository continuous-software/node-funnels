var test = require('tape');
var replace = require('../lib/schemaTree.js');

test('output the same tree (non nested)', t => {
  const schema = {
    foo: 'bar',
    bar: 'foo'
  };
  const actual = replace(schema);
  t.deepEqual(actual, schema);
  t.end();
});

test('output the same tree (nested)', t => {
  const schema = {
    foo: 'bar',
    bar: {
      nested: 'blah'
    }
  };
  const actual = replace(schema);
  t.deepEqual(actual, schema);
  t.end();
});

test('should replace ref (non nested', t => {
  const schema = {
    $ref: '#/foo'
  };
  const def = {
    foo: {
      bar: 'blah'
    }
  };
  const actual = replace(schema, def);
  t.deepEqual(actual, {
    bar: 'blah'
  }, 'should have replaced the props');
  t.end();
});

test('should replace $ref (nested', t=> {
  const schema = {
    prop: {
      propdeep1: {$ref: '#/foo'},
      propdepp2: {
        blah: [{foobb: 'barbb'}, 2]
      }
    }
  };
  const def = {
    foo: {
      bar: 'blah'
    }
  };
  const actual = replace(schema, def);
  t.deepEqual(actual, {
    prop: {
      propdeep1: {
        bar: 'blah'
      },
      propdepp2: {
        blah: [{foobb: 'barbb'}, 2]
      }
    }
  }, 'should have replaced the props');
  t.end();
});



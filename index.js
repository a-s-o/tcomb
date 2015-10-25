'use strict';

const t = require('tcomb-validation');

const Type = t.irreducible('Type', t.isType);

function typedFunc (obj) {
   return t.func(obj.inputs || [], obj.outputs || t.Any).of(obj.fn);
}

// Testing helpers

function test (value, type) {
   const result = t.validate(value, type);
   if (!result.isValid()) t.fail(result.firstError().message);
}

function testNot (value, type) {
   const result = t.validate(value, type);
   if (result.isValid()) t.fail(`Expected value not to be ${t.getTypeName(type)}`);
}

const testFunc = typedFunc({
   inputs: [t.Any, Type],
   fn: test
});

testFunc.not = typedFunc({
   inputs: [t.Any, Type],
   fn: testNot
});

module.exports = t.mixin(t, {
   Type,

   test: testFunc,
   typedFunc: typedFunc({
      inputs: [t.struct({
         inputs: t.maybe(t.Array),
         output: t.maybe(Type),
         fn: t.Function
      })],
      output: t.Function,
      fn: typedFunc
   })
});

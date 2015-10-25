'use strict';

const t = require('tcomb-validation');

const Type = t.irreducible('Type', t.isType);

function test (value, type) {
   const result = t.validate(value, type);
   if (!result.isValid()) t.fail(result.firstError());
}

function typedFunc (obj) {
   return t.func(obj.inputs || [], obj.outputs || t.Any).of(obj.fn);
}

module.exports = t.mixin(t, {
   Type,

   test: typedFunc({
      inputs: [t.Any, Type],
      fn: test
   }),
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

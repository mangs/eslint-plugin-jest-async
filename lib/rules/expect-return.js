/**
 * @fileoverview Enforces returning store.dispatch() when asynchronously making a test assertion
 * @author Eric L. Goldstein
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces returning store.dispatch() when asynchronously making a test assertion',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null,  // or 'code' or 'whitespace'
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    return {
      CallExpression(node) {
        const hasMemberExpression =
          'callee' in node && node.callee.type === 'MemberExpression';
        if (hasMemberExpression) {
          const memberExpression = node.callee;
          const hasThen = 'property' in memberExpression && memberExpression.property.name === 'then';
          const hasDispatch =
            'object' in memberExpression
            && 'callee' in memberExpression.object
            && 'property' in memberExpression.object.callee
            && memberExpression.object.callee.property.name === 'dispatch';
          if (hasDispatch && hasThen && node.parent.type !== 'ReturnStatement') {
            context.report({
              message: 'Return async dispatch expressions',
              node,
            });
          }
        }
      },
    };
  },
};

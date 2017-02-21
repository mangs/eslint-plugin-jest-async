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
        // Ensure we're looking at the outermost MemberExpression of the Promise chain
        const hasParentMemberExpression = node.parent.type === 'MemberExpression';

        const hasParentReturnStatement = node.parent.type === 'ReturnStatement';
        const hasMemberExpression =
          'callee' in node && node.callee.type === 'MemberExpression';
        if (!hasParentMemberExpression && hasMemberExpression) {
          const memberExpression = node.callee;
          const hasThen = 'property' in memberExpression && memberExpression.property.name === 'then';
          const hasDispatch =
            'object' in memberExpression
            && 'callee' in memberExpression.object
            && 'property' in memberExpression.object.callee
            && memberExpression.object.callee.property.name === 'dispatch';
          if (hasDispatch && hasThen && !hasParentReturnStatement) {
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

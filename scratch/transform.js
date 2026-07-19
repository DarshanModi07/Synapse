module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let dirty = false;

  // 1. Remove console.log
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { name: 'console' },
      property: { name: 'log' }
    }
  }).forEach(path => {
    dirty = true;
    if (path.parentPath.node.type === 'ExpressionStatement') {
      j(path.parentPath).remove();
    } else {
      j(path).remove();
    }
  });

  // 2. Remove TODO and FIXME comments
  root.find(j.Node).forEach(path => {
    const node = path.node;
    if (node.comments && node.comments.length > 0) {
      const filteredComments = node.comments.filter(c => {
        const val = c.value.trim().toUpperCase();
        if (val.startsWith('TODO') || val.startsWith('FIXME')) {
          dirty = true;
          return false;
        }
        return true;
      });
      if (filteredComments.length !== node.comments.length) {
        node.comments = filteredComments;
      }
    }
  });

  return dirty ? root.toSource() : null;
};

// 根据条件删除特定树节点
export function removeNodes(treeData, condition) {
  function traverseAndRemove(node) {
    if (condition(node)) {
      return null; // 删除节点
    }

    if (node.children && node.children.length > 0) {
      const prunedChildren = [];
      for (let i = 0; i < node.children.length; i++) {
        const prunedChild = traverseAndRemove(node.children[i]);
        if (prunedChild !== null) {
          prunedChildren.push(prunedChild);
        }
      }
      node.children = prunedChildren;
    }

    return node;
  }

  const prunedTreeData = [];
  for (let i = 0; i < treeData.length; i++) {
    const prunedNode = traverseAndRemove(treeData[i]);
    if (prunedNode !== null) {
      prunedTreeData.push(prunedNode);
    }
  }

  return prunedTreeData;
}

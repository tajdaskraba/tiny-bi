import * as d3 from 'd3';
import myData from './data/dataInput';
import { nodeSum } from './data/dataUtils';

const root: d3.HierarchyNode<any> = d3.hierarchy(myData);

// print first level of hierarchy
console.log(root.children);

// print leafs
root.leaves().forEach(leaf => {
  console.log(leaf.data.value);
});

// parent p has children c1, c2, c3. get c1.value + c2.value + c3.value
// export const getChildrenSum = (nodeName: string): number => {
//   const node = root.descendants().find(n => n.data.name === nodeName);
//   if (node) {
//     return nodeSum(node);
//   } else {
//     console.error(`Node with name ${nodeName} not found.`);
//     return 0;
//   }
// }
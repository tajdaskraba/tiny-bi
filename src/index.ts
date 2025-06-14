import * as d3 from 'd3';
import { initialRawData } from './data/dataRaw';
import { createHierarchyData } from './data/dataTransform';

const root = d3.hierarchy(createHierarchyData(initialRawData, "root"));

// print first level of hierarchy
console.log("first level", root.children);

// print leaf values
root.leaves().forEach(leaf => {
  console.log("leaves", leaf.data.value);
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

const data = createHierarchyData(initialRawData, "root");
console.log("data", data);
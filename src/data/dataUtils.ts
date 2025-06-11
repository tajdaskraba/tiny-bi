import * as d3 from 'd3';
import myData from './dataInput';

const root = d3.hierarchy(myData);

export const nodeSum = (n:any) => {
  let sum;
  sum = root.sum((n: any) => n.value || 0);
  return sum;
}

console.log(nodeSum(root));
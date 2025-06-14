import * as d3 from 'd3';
import {initialRawData} from './dataRaw';

const root = d3.hierarchy(initialRawData);

export const nodeSum = (n:any) => {
  let sum;
  sum = root.sum((n: any) => n.value || 0);
  return sum;
}
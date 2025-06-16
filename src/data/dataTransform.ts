import { Node, RawNode } from '../types/index';

let idCounter = 0;

export const transformRawNodes = (rawData: RawNode[]): Node[] => {
  return rawData.map(rawNode => {
    const [name, value] = Object.entries(rawNode)[0];

    if (typeof value === 'number') {
      return {
        id: `node-${idCounter++}`,
        name,
        value,
        status: 'unaltered',
      };
    } else {
      return {
        id: `node-${idCounter++}`,
        name,
        status: 'unaltered',
        children: transformRawNodes(value),
        isCollapsed: false,
      };
    }
  });
}

export const createHierarchyData = (rawData: RawNode[], rootName: string = 'AC'): Node => {
  idCounter = 0;
  return {
    id: `node-${idCounter++}`,
    name: rootName,
    status: 'unaltered',
    children: transformRawNodes(rawData),
    isCollapsed: false,
  };
}
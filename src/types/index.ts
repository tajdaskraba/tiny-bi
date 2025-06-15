export type NodeState = 'unaltered' | 'skipped' | 'inverted';

export interface Node {
  id: string;
  name: string;
  value?: number;
  children?: Node[];
  status: NodeState;
}

export type RawNode = { [key: string]: number | RawNode[] };
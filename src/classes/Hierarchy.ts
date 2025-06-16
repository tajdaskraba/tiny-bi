import * as d3 from 'd3';
import { Node, NodeState, RawNode } from '../types/index';
import { createHierarchyData } from '../data/dataTransform';

export class Hierarchy {
  private root: d3.HierarchyNode<Node>;

  constructor(rawData: RawNode[], rootName: string = 'root') {
    const hierarchyData = createHierarchyData(rawData, rootName);
    this.root = d3.hierarchy(hierarchyData);
    this.calculateValues();
  }

  private calculateValues(): void {
    this.root.sum(d => {
      const originalValue = d.value || 0;
      if (d.status === 'skipped') {
        return 0;
      }
      if (d.status === 'inverted') {
        return -originalValue;
      }
      return originalValue;
    });
  }

  public updateNodeState(nodeId: string, newState: NodeState): void {
    const node = this.root.descendants().find(n => n.data.id === nodeId);
    if (node) {
      if (node.children) {
        console.warn('Only leaf nodes can be inverted or skipped.');
        return;
      }
      node.data.status = newState;
      this.calculateValues();
    } else {
      console.error(`Node id ${nodeId} not found.`);
    }
  }

  public updateChildrenState(nodeId: string, newState: NodeState): void {
    const node = this.root.descendants().find(n => n.data.id === nodeId);
    if (node && node.children) {
      node.leaves().forEach(leaf => {
        leaf.data.status = newState;
      });
      this.calculateValues();
    } else {
      console.error(`Node with id ${nodeId} is not a parent node.`);
    }
  }

  public toggleNodeCollapsed(nodeId: string): void {
    const node = this.root.descendants().find(n => n.data.id === nodeId);
    if (node) {
      node.data.isCollapsed = !node.data.isCollapsed;
    } else {
      console.error(`Node id ${nodeId} not found.`);
    }
  }

  public getHierarchy(): d3.HierarchyNode<Node> {
    return this.root;
  }
} 
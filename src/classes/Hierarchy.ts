import * as d3 from 'd3';
import { Node, NodeState, RawNode } from '../types/index';
import { createHierarchyData } from '../data/dataTransform';

export class Hierarchy {
  private root: d3.HierarchyNode<Node>;
  private idCounter = 0;

  constructor(rawData?: RawNode[], rootName: string = 'root') {
    if (rawData && rawData.length > 0) {
      const hierarchyData = createHierarchyData(rawData, rootName);
      this.root = d3.hierarchy(hierarchyData);
    } else {
      this.root = d3.hierarchy<Node>({
        id: this.generateId(),
        name: rootName,
        status: 'unaltered',
        children: []
      });
    }
    this.calculateValues();
  }

  private generateId(): string {
    this.idCounter++;
    return `node-${this.idCounter}`;
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

  public addNode(parentId: string, newNodeData: Partial<Node>): void {
    const parent = this.root.descendants().find(n => n.data.id === parentId);
    if (parent) {
      const newNode: Node = {
        id: this.generateId(),
        name: newNodeData.name || 'new node',
        value: newNodeData.value,
        status: 'unaltered',
        children: newNodeData.children,
      };
      if (!parent.data.children) {
        parent.data.children = [];
      }
      parent.data.children.push(newNode);
      
      // recreate the hierarchy from the data to add the new node
      const newHierarchy = d3.hierarchy(this.root.data);
      const oldNodeMap = new Map(this.root.descendants().map(d => [d.data.id, d]));
      this.root = newHierarchy;

      this.root.descendants().forEach(newNode => {
        const oldNode = oldNodeMap.get(newNode.data.id);
        if (oldNode) {
          newNode.data.isCollapsed = oldNode.data.isCollapsed;
        }
      });

      this.calculateValues();
    } else {
      console.error(`Parent node with id ${parentId} not found.`);
    }
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

  public deleteNode(nodeId: string): void {
    const node = this.root.descendants().find(n => n.data.id === nodeId);
    if (!node) {
      console.error(`Node with id ${nodeId} not found.`);
      return;
    }

    const parent = node.parent;
    if (parent && parent.data.children) {
      const index = parent.data.children.findIndex(child => child.id === nodeId);
      if (index > -1) {
        parent.data.children.splice(index, 1);
        
        // recreate hierarchy after deleting node
        const newHierarchy = d3.hierarchy(this.root.data);
        const oldNodeMap = new Map(this.root.descendants().map(d => [d.data.id, d]));
        this.root = newHierarchy;

        this.root.descendants().forEach(newNode => {
          const oldNode = oldNodeMap.get(newNode.data.id);
          if (oldNode) {
            newNode.data.isCollapsed = oldNode.data.isCollapsed;
          }
        });

        this.calculateValues();
      }
    } else {
      console.error(`Could not delete node with id ${nodeId}, parent not found or has no children.`);
    }
  }

  public updateNodeData(nodeId: string, newData: Partial<Node>): void {
    const node = this.root.descendants().find(n => n.data.id === nodeId);
    if (node) {
      if (newData.name !== undefined) {
        node.data.name = newData.name;
      }
      if (Object.prototype.hasOwnProperty.call(newData, 'value')) {
        node.data.value = newData.value;
        this.calculateValues();
      }
    } else {
      console.error(`Node with id ${nodeId} not found.`);
    }
  }

  public toRawData(): RawNode[] {
    const transformNode = (node: d3.HierarchyNode<Node>): RawNode => {
      const rawNode: RawNode = {};
      const key = node.data.name;
  
      if (node.children && node.children.length > 0) {
        rawNode[key] = node.children.map(transformNode);
      } else {
        rawNode[key] = node.data.value;
      }
  
      return rawNode;
    };

    if (!this.root.children) {
      return [];
    }
  
    return this.root.children.map(transformNode);
  }
} 
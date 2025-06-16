import React from 'react';
import * as d3 from 'd3';
import { Node } from '../../types/index';
import './NodeRow.scss';
import ArrowDown from '../../assets/icons/arrow-down.svg';
import ArrowUp from '../../assets/icons/arrow-up.svg';

interface NodeRowProps {
  node: d3.HierarchyNode<Node>;
  depth?: number;
  onContextMenu: (event: React.MouseEvent, node: d3.HierarchyNode<Node>) => void;
  onToggle: (node: d3.HierarchyNode<Node>) => void;
}

const formatValue = (value: number | undefined, isRoot: boolean) => {
    if (value === undefined) return '';
    if (!isRoot && Math.abs(value) >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
}

export const NodeRow: React.FC<NodeRowProps> = ({ node, depth = 0, onContextMenu, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isInverted = node.data.status === 'inverted';

  const isSkippedLeaf = !hasChildren && node.data.status === 'skipped';
  const areAllChildrenSkipped = hasChildren && node.leaves().every(l => l.data.status === 'skipped');
  const isRowSkipped = isSkippedLeaf || areAllChildrenSkipped;

  const getUnalteredSum = (n: d3.HierarchyNode<Node>) => {
    let sum = 0;
    n.leaves().forEach(leaf => {
        sum += leaf.data.value || 0;
    });
    return sum;
  }

  const nodeName = () => {
      let prefix = '';
      if (isInverted && !hasChildren) prefix = '- ';
      return prefix + node.data.name;
  }

  let displayValue;
  if (isSkippedLeaf) {
      displayValue = node.data.value;
  } else if (areAllChildrenSkipped) {
      displayValue = getUnalteredSum(node);
  } else {
      displayValue = node.value;
  }

  return (
    <div onContextMenu={(e) => onContextMenu(e, node)}>
        <div style={{ paddingLeft: `${depth * 20}px` }}>
            <div className={`node-row ${isRowSkipped ? 'skipped' : ''}`}>
                <span className="node-name" onClick={() => hasChildren && onToggle(node)}>
                    {hasChildren && (
                        <span className={`toggle ${node.data.isCollapsed ? 'collapsed' : 'expanded'}`}>
                            {node.data.isCollapsed ? <img className="toggle-icon" src={ArrowUp} alt="Expand" /> : <img className="toggle-icon" src={ArrowDown} alt="Collapse" />}
                        </span>
                    )}
                    {nodeName()}
                </span>
                <span className={`node-value ${hasChildren ? 'sum' : ''}`}>{formatValue(displayValue, depth === 0)}</span>
            </div>
        </div>
        {hasChildren && !node.data.isCollapsed && (
            <div>
                {node.children?.map(child => (
                    <NodeRow key={child.data.id} node={child} depth={depth + 1} onContextMenu={onContextMenu} onToggle={onToggle}/>
                ))}
            </div>
        )}
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Node } from '../../types/index';
import './NodeRow.scss';
import { ArrowDownIcon } from '../Icons/ArrowDownIcon';
import { ArrowUpIcon } from '../Icons/ArrowUpIcon';
import { AddNodeRow } from '../AddNodeRow/AddNodeRow';
import { TrashIcon } from '../Icons/TrashIcon';
import { formatValue } from '../../utils/formatValue';

interface NodeRowProps {
  node: d3.HierarchyNode<Node>;
  depth?: number;
  onContextMenu: (event: React.MouseEvent, node: d3.HierarchyNode<Node>) => void;
  onToggle: (node: d3.HierarchyNode<Node>) => void;
  onAddNode: (parentId: string, name: string, value?: number) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, name: string, value?: number) => void;
}

export const NodeRow: React.FC<NodeRowProps> = ({ node, depth = 0, onContextMenu, onToggle, onAddNode, onDeleteNode, onUpdateNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const getInitialInputValue = () => {
    let initialValue = node.data.name;
    const value = node.data.children ? node.value : node.data.value;
    if (value !== undefined) {
        initialValue += `=${value}`;
    }
    return initialValue;
  }

  const [inputValue, setInputValue] = useState(getInitialInputValue());
  const hasChildren = node.data.children !== undefined;
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

  useEffect(() => {
    if (!isEditing) {
      setInputValue(getInitialInputValue());
    }
  }, [isEditing, node.data.name, node.data.value]);

  const handleNameClick = () => {
    setIsEditing(true);
  }

  const handleInputBlur = () => {
    setIsEditing(false);
    const trimmedValue = inputValue.trim();

    if (trimmedValue === getInitialInputValue()) {
        return;
    }
    
    if (trimmedValue === '') {
        onDeleteNode(node.data.id);
        return;
    }
    
    const parts = trimmedValue.split('=');
    const name = parts[0].trim();
    let value: number | undefined;

    if (parts.length > 1) {
        const parsedValue = parseFloat(parts[1].trim());
        value = isNaN(parsedValue) ? undefined : parsedValue;
    } else {
        value = undefined;
    }
    onUpdateNode(node.data.id, name, value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  let displayValue;
  if (isSkippedLeaf) {
      displayValue = node.data.value;
  } else if (areAllChildrenSkipped) {
      displayValue = getUnalteredSum(node);
  } else {
      displayValue = node.value;
  }

  return (
    <div className="node-row-container" onContextMenu={(e) => onContextMenu(e, node)}>
        <div style={{ paddingLeft: `${depth * 20}px` }}>
            <div className={`node-row ${isRowSkipped ? 'skipped' : ''}`}>
                <span className="node-name" onClick={handleNameClick}>
                    {hasChildren && (
                        <span className={`toggle ${node.data.isCollapsed ? 'collapsed' : 'expanded'}`} onClick={(e) => { e.stopPropagation(); onToggle(node); }}>
                            {node.data.isCollapsed ? <ArrowUpIcon className="toggle-icon" /> : <ArrowDownIcon className="toggle-icon" />}
                        </span>
                    )}
                    {isEditing ? (
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                        className="node-name-input"
                      />
                    ) : (
                      nodeName()
                    )}
                </span>
                <span className={`node-value ${hasChildren ? 'sum' : ''}`}>
                    {formatValue(displayValue)}
                    <TrashIcon className="delete-icon" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDeleteNode(node.data.id); }} />
                </span>
            </div>
        </div>
        {hasChildren && !node.data.isCollapsed && (
            <div className="children-container">
                {node.children?.map(child => (
                    <NodeRow key={child.data.id} node={child} depth={depth + 1} onContextMenu={onContextMenu} onToggle={onToggle} onAddNode={onAddNode} onDeleteNode={onDeleteNode} onUpdateNode={onUpdateNode}/>
                ))}
                <div className="add-child-container">
                    <AddNodeRow depth={depth + 1} onAdd={(name, value) => onAddNode(node.data.id, name, value)} type="child" />
                </div>
            </div>
        )}
    </div>
  );
}; 
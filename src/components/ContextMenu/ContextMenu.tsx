import React from 'react';
import * as d3 from 'd3';
import { Node } from '../../types';
import './ContextMenu.scss';

interface ContextMenuProps {
  x: number;
  y: number;
  node: d3.HierarchyNode<Node>;
  onClose: () => void;
  onInvert: (node: d3.HierarchyNode<Node>) => void;
  onSkip: (node: d3.HierarchyNode<Node>) => void;
  onReset: (node: d3.HierarchyNode<Node>) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, node, onClose, onInvert, onSkip, onReset }) => {
  const isLeaf = !node.children || node.children.length === 0;

  const isResetDisabled = isLeaf
    ? node.data.status === 'unaltered'
    : node.leaves().every(leaf => leaf.data.status === 'unaltered');

  const handleInvert = () => {
    onInvert(node);
    onClose();
  };

  const handleSkip = () => {
    onSkip(node);
    onClose();
  };

  const handleReset = () => {
    if (isResetDisabled) return;
    onReset(node);
    onClose();
  }

  return (
    <div className="context-menu" style={{ top: y, left: x }} onClick={(e) => e.stopPropagation()}>
      <ul>
        {isLeaf ? (
          <>
            <li onClick={handleInvert}>Invert Value</li>
            <li onClick={handleSkip}>Skip Node</li>
          </>
        ) : (
          <>
            <li onClick={handleInvert}>Invert All Children</li>
            <li onClick={handleSkip}>Skip All Children</li>
          </>
        )}
        <hr />
        <li onClick={handleReset} className={isResetDisabled ? 'disabled' : ''}>Reset</li>
      </ul>
    </div>
  );
}; 
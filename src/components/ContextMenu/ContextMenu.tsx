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
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, node, onClose, onInvert, onSkip }) => {
  const handleInvert = () => {
    onInvert(node);
    onClose();
  };

  const handleSkip = () => {
    onSkip(node);
    onClose();
  };

  return (
    <div className="context-menu" style={{ top: y, left: x }} onClick={(e) => e.stopPropagation()}>
      <ul>
        <li onClick={handleInvert}>Invert Value</li>
        <li onClick={handleSkip}>Skip Node</li>
      </ul>
    </div>
  );
}; 
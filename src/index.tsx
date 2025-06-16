import { createRoot } from 'react-dom/client';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { initialRawData } from './data/dataRaw';
import { Hierarchy } from './classes/Hierarchy';
import { Node, NodeState } from './types';
import { NodeRow } from './components/NodeRow/NodeRow';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import './index.scss';

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    node: d3.HierarchyNode<Node> | null;
}

const App = () => {
    const hierarchy = useRef(new Hierarchy(initialRawData, "root"));
    const [renderKey, setRenderKey] = useState(0);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, node: null });

    const forceRender = () => {
        setRenderKey(prev => prev + 1);
    };

    const handleContextMenu = useCallback((event: React.MouseEvent, node: d3.HierarchyNode<Node>) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ visible: true, x: event.clientX, y: event.clientY, node });
    }, []);

    const closeContextMenu = useCallback(() => {
        if (contextMenu.visible) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    }, [contextMenu]);

    useEffect(() => {
        window.addEventListener('click', closeContextMenu);
        return () => {
            window.removeEventListener('click', closeContextMenu);
        };
    }, [closeContextMenu]);

    const handleInvert = (node: d3.HierarchyNode<Node>) => {
        const isLeaf = !node.children || node.children.length === 0;
        if (isLeaf) {
            const currentStatus = node.data.status;
            const newStatus: NodeState = currentStatus === 'inverted' ? 'unaltered' : 'inverted';
            hierarchy.current.updateNodeState(node.data.id, newStatus);
        } else {
            hierarchy.current.updateChildrenState(node.data.id, 'inverted');
        }
        forceRender();
    };
    
    const handleSkip = (node: d3.HierarchyNode<Node>) => {
        const isLeaf = !node.children || node.children.length === 0;
        if (isLeaf) {
            const currentStatus = node.data.status;
            const newStatus: NodeState = currentStatus === 'skipped' ? 'unaltered' : 'skipped';
            hierarchy.current.updateNodeState(node.data.id, newStatus);
        } else {
            hierarchy.current.updateChildrenState(node.data.id, 'skipped');
        }
        forceRender();
    };

    const handleReset = (node: d3.HierarchyNode<Node>) => {
        const isLeaf = !node.children || node.children.length === 0;
        if (isLeaf) {
            hierarchy.current.updateNodeState(node.data.id, 'unaltered');
        } else {
            hierarchy.current.updateChildrenState(node.data.id, 'unaltered');
        }
        forceRender();
    }

    const handleToggle = (node: d3.HierarchyNode<Node>) => {
        hierarchy.current.toggleNodeCollapsed(node.data.id);
        forceRender();
    };

    const hierarchyData = hierarchy.current.getHierarchy();

    return (
        <div className='app' key={renderKey} onClick={closeContextMenu}>
            <div className='container'>
                {hierarchyData.children?.map(child => (
                    <NodeRow key={child.data.id} node={child} onContextMenu={handleContextMenu} onToggle={handleToggle} />
                ))}
            </div>
            {contextMenu.visible && contextMenu.node && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    node={contextMenu.node}
                    onClose={closeContextMenu}
                    onInvert={handleInvert}
                    onSkip={handleSkip}
                    onReset={handleReset}
                />
            )}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { Hierarchy } from './classes/Hierarchy';
import { Node, NodeState, RawNode } from './types';
import { NodeRow } from './components/NodeRow/NodeRow';
import { AddNodeRow } from './components/AddNodeRow/AddNodeRow';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { ImportButton } from './components/ImportButton/ImportButton';
import { ExportButton } from './components/ExportButton/ExportButton';
import './index.scss';

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    node: d3.HierarchyNode<Node> | null;
}

const App = () => {
    const hierarchy = useRef(new Hierarchy());
    const [renderKey, setRenderKey] = useState(0);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, node: null });
    const [theme, setTheme] = useState('light');

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

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleImport = (jsonData: RawNode[]) => {
        hierarchy.current = new Hierarchy(jsonData);
        forceRender();
    };

    const handleExport = () => {
        const rawData = hierarchy.current.toRawData();
        const jsonString = JSON.stringify(rawData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleToggle = (node: d3.HierarchyNode<Node>) => {
        hierarchy.current.toggleNodeCollapsed(node.data.id);
        forceRender();
    };

    const handleAddNode = (parentId: string, name: string, value?: number) => {
        const children: Node[] | undefined = value === undefined ? [] : undefined;
        hierarchy.current.addNode(parentId, { name, value, children });
        forceRender();
    };

    const handleDeleteNode = (nodeId: string) => {
        hierarchy.current.deleteNode(nodeId);
        forceRender();
    };

    const handleUpdateNode = (nodeId: string, name: string, value?: number) => {
        hierarchy.current.updateNodeData(nodeId, { name, value });
        forceRender();
    };

    const hierarchyData = hierarchy.current.getHierarchy();

    return (
        <div className={`app ${theme}-theme`} key={renderKey} onClick={closeContextMenu}>
            <div className="main-content">
                <div className="fixed-buttons">
                    <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                    <ImportButton onImport={handleImport} />
                    <ExportButton onExport={handleExport} />
                </div>
                <div className='container'>
                    {hierarchyData.children?.map(child => (
                        <NodeRow key={child.data.id} node={child} onContextMenu={handleContextMenu} onToggle={handleToggle} onAddNode={handleAddNode} onDeleteNode={handleDeleteNode} onUpdateNode={handleUpdateNode}/>
                    ))}
                    {(!hierarchyData.children || hierarchyData.children.length === 0) && (
                        <AddNodeRow depth={0} onAdd={(name, value) => handleAddNode(hierarchyData.data.id, name, value)} type="root" />
                    )}
                </div>
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
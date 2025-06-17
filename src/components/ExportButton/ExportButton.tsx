import React from 'react';
import { ExportIcon } from '../Icons/ExportIcon';

interface ExportButtonProps {
    onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
    return (
        <button onClick={onExport} className="export-button">
            <ExportIcon className="export-icon" />
        </button>
    );
}; 
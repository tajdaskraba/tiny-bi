import React, { useRef } from 'react';
import { RawNode } from '../../types';
import { ImportIcon } from '../Icons/ImportIcon';
import './ImportButton.scss';

interface ImportButtonProps {
    onImport: (jsonData: RawNode[]) => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const jsonData = JSON.parse(text);
                        onImport(jsonData);
                    }
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <button onClick={handleIconClick} className="import-button">
                <ImportIcon className="import-icon" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".json"
            />
        </>
    );
}; 
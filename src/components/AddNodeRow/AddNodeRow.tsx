import React, { useState } from 'react';
import { PlusIcon } from '../Icons/PlusIcon';
import './AddNodeRow.scss';

interface AddNodeRowProps {
  depth: number;
  onAdd: (name: string, value?: number) => void;
  type: 'root' | 'child';
}

export const AddNodeRow: React.FC<AddNodeRowProps> = ({ depth, onAdd, type }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      
        // parse "key=value" or only "key"
        const parts = inputValue.trim().split('=');
        const name = parts[0].trim();
        const value = parts.length > 1 ? parseFloat(parts[1].trim()) : undefined;
        
        onAdd(name, value);
        setInputValue('');
        setIsAdding(false);
    } else if (event.key === 'Escape') {
        setIsAdding(false);
        setInputValue('');
    }
  };

  if (!isAdding) {
    return (
      <div style={{ paddingLeft: `${depth * 20}px` }} className="add-node-row">
        <button onClick={handleAddClick} className="add-button">
          <PlusIcon className="add-icon" />
          {type === 'root' ? 'Root' : 'Child'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: `${depth * 20}px` }} className="add-node-row">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={type === 'root' ? 'Root' : 'Key or Key=Value'}
        autoFocus
        onBlur={() => { setIsAdding(false); setInputValue(''); }}
      />
    </div>
  );
}; 
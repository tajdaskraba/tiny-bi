import React from 'react';
import { SunIcon } from '../Icons/SunIcon';
import { MoonIcon } from '../Icons/MoonIcon';

interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button onClick={onToggle} className="theme-toggle">
      {theme === 'light' ? (
        <MoonIcon className="theme-icon" />
      ) : (
        <SunIcon className="theme-icon" />
      )}
    </button>
  );
}; 
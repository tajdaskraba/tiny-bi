import React from 'react';

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      fill="currentColor" 
      className={className}
    >
      <path d="M505.752,123.582c-8.331-8.331-21.839-8.331-30.17,0L256,343.163L36.418,123.582c-8.331-8.331-21.839-8.331-30.17,0 s-8.331,21.839,0,30.17l234.667,234.667c8.331,8.331,21.839,8.331,30.17,0l234.667-234.667 C514.083,145.42,514.083,131.913,505.752,123.582z"/>
    </svg>
  );
}; 
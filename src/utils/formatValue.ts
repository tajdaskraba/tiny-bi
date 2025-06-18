import * as d3 from 'd3';

export const formatValue = (value: number | undefined): string => {
  if (value === undefined) {
    return '';
  }
  if (value === 0) {
    return '0';
  }

  if (Math.abs(value) < 1000) {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(2);
  }

  const valueInK = value / 1000;
  const formattedNumber = d3.format('.2~f')(valueInK);
  
  return `${formattedNumber}K`;
};
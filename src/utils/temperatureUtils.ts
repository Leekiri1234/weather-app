export const convertTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): number => {
  if (unit === 'celsius') {
    return Math.round(temp);
  } else {
    return Math.round((temp * 9/5) + 32);
  }
};

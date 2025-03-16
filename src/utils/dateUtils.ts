import { format, parseISO } from 'date-fns';

export const formatTime = (timeString: string) => {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return timeString;
  }
};

export const formatHourlyTime = (time: string) => format(parseISO(time), 'HH:mm');

export const formatFullDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

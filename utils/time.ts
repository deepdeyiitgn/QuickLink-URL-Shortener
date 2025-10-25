
const TIME_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: 'year', seconds: 31536000 },
  { unit: 'month', seconds: 2592000 },
  { unit: 'week', seconds: 604800 },
  { unit: 'day', seconds: 86400 },
  { unit: 'hour', seconds: 3600 },
  { unit: 'minute', seconds: 60 },
];

export const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  
  if (seconds < 5) return 'just now';

  for (const { unit, seconds: unitSeconds } of TIME_UNITS) {
    const interval = Math.floor(seconds / unitSeconds);
    if (interval >= 1) {
      // Use Intl.RelativeTimeFormat for better localization in a real app
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return `${Math.floor(seconds)} seconds ago`;
};

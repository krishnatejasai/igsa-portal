export const travelLabels = { 'offering-ride': 'Offering a ride', 'need-ride': 'Looking for a ride', 'travel-together': 'Travel together' };
export const displayDate = value => value ? new Date(value + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

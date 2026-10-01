const summaries = {
  president: 'Leads IGSA’s vision, team, and student initiatives.',
  'vice president': 'Coordinates the board and supports IGSA’s programs.',
  secretary: 'Keeps meetings, records, and team communication organized.',
  'executive secretary': 'Keeps meetings, records, and team communication organized.',
  treasurer: 'Manages budgets, expenses, and financial planning.',
  'it director': 'Maintains IGSA’s website and digital tools.',
  'event director': 'Plans events that bring our community together.',
  'event manager': 'Coordinates event logistics, volunteers, and activities.',
  'social media manager': 'Shares IGSA’s stories and updates across social media.',
  'creative director': 'Shapes IGSA’s visual identity and creative designs.',
  'marketing manager': 'Promotes events and grows student engagement.',
  'pr director': 'Builds campus partnerships and community connections.',
};
export const roleSummary = position => summaries[position.trim().toLowerCase().replaceAll('-', ' ')] || 'Supports IGSA’s events and student community.';

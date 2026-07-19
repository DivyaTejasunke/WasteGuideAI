// Central lookup for how each waste category is labeled and colored
// across badges, charts, and map markers.

export const CATEGORY_META = {
  Plastic: { color: '#2D8A5B', group: 'Recycling', marker: 'green' },
  Paper: { color: '#2D8A5B', group: 'Recycling', marker: 'green' },
  Cardboard: { color: '#2D8A5B', group: 'Recycling', marker: 'green' },
  Glass: { color: '#2D8A5B', group: 'Recycling', marker: 'green' },
  Metal: { color: '#2D8A5B', group: 'Recycling', marker: 'green' },
  Organic: { color: '#6E9C3B', group: 'Organic', marker: 'blue' },
  Textile: { color: '#8A8072', group: 'Mixed', marker: 'purple' },
  Rubber: { color: '#8A8072', group: 'Mixed', marker: 'purple' },
  Medical: { color: '#C44536', group: 'Hazardous', marker: 'red' },
  Hazardous: { color: '#C44536', group: 'Hazardous', marker: 'red' },
  Electronic: { color: '#6C4AB6', group: 'Electronic', marker: 'purple' },
  Mixed: { color: '#8A8072', group: 'Mixed', marker: 'purple' },
  Construction: { color: '#8A8072', group: 'Mixed', marker: 'purple' },
  Battery: { color: '#C44536', group: 'Hazardous', marker: 'red' },
  Chemicals: { color: '#C44536', group: 'Hazardous', marker: 'red' },
}

export function getCategoryColor(category) {
  return CATEGORY_META[category]?.color || '#7A9278'
}

export function getMarkerColor(category) {
  const key = CATEGORY_META[category]?.marker || 'purple'
  const map = {
    green: '#2D8A5B',
    blue: '#3F7CB0',
    red: '#C44536',
    purple: '#6C4AB6',
  }
  return map[key]
}

export const HAZARD_META = {
  Low: { color: '#2D8A5B' },
  Medium: { color: '#C99A2E' },
  High: { color: '#C44536' },
}

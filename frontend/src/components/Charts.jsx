import {
  Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler,
} from 'chart.js'
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2'
import { getCategoryColor } from '../utils/categoryMeta'

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

const FONT = { family: "'Public Sans', sans-serif" }

function ChartShell({ title, children }) {
  return (
    <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 bg-white/50 dark:bg-forest-900/30 p-5">
      <p className="text-xs uppercase tracking-wide font-mono text-ink/50 dark:text-paper/50 mb-4">{title}</p>
      <div className="h-64">{children}</div>
    </div>
  )
}

export function RecyclableDoughnut({ stats }) {
  const recyclable = stats?.recyclableCount ?? 0
  const nonRecyclable = (stats?.totalScans ?? 0) - recyclable
  return (
    <ChartShell title="Recyclable vs non-recyclable">
      <Doughnut
        data={{
          labels: ['Recyclable', 'Non-recyclable'],
          datasets: [{
            data: [recyclable, nonRecyclable],
            backgroundColor: ['#2D8A5B', '#8A8072'],
            borderWidth: 0,
          }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { font: FONT } } },
        }}
      />
    </ChartShell>
  )
}

export function CategoryBarChart({ stats }) {
  const freq = stats?.categoryFrequency || {}
  const labels = Object.keys(freq)
  const data = Object.values(freq)
  return (
    <ChartShell title="Waste categories">
      <Bar
        data={{
          labels,
          datasets: [{
            label: 'Scans',
            data,
            backgroundColor: labels.map(getCategoryColor),
            borderRadius: 6,
          }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { font: FONT }, grid: { display: false } },
            y: { ticks: { font: FONT, precision: 0 }, grid: { color: 'rgba(16,32,26,0.06)' } },
          },
        }}
      />
    </ChartShell>
  )
}

export function WeeklyActivityLine({ stats }) {
  const daily = stats?.dailyScans || []
  return (
    <ChartShell title="Last 7 days activity">
      <Line
        data={{
          labels: daily.map((d) => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })),
          datasets: [{
            label: 'Scans',
            data: daily.map((d) => d.count),
            borderColor: '#1B4332',
            backgroundColor: 'rgba(27,67,50,0.12)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#1B4332',
          }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { font: FONT }, grid: { display: false } },
            y: { ticks: { font: FONT, precision: 0 }, grid: { color: 'rgba(16,32,26,0.06)' } },
          },
        }}
      />
    </ChartShell>
  )
}

export function WasteTypesPie({ stats }) {
  const freq = stats?.categoryFrequency || {}
  const labels = Object.keys(freq)
  const data = Object.values(freq)
  return (
    <ChartShell title="Waste types">
      <Pie
        data={{
          labels,
          datasets: [{
            data,
            backgroundColor: labels.map(getCategoryColor),
            borderWidth: 0,
          }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { font: FONT, boxWidth: 10 } } },
        }}
      />
    </ChartShell>
  )
}

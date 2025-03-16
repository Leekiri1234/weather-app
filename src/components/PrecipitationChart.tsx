import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PrecipitationChartProps {
  hourlyTime: string[];
  hourlyPrecipitation: number[];
}

const PrecipitationChart = ({ hourlyTime, hourlyPrecipitation }: PrecipitationChartProps) => {
  const next24Hours = hourlyTime.slice(0, 24);
  const next24Precipitation = hourlyPrecipitation.slice(0, 24);

  const data = {
    labels: next24Hours.map(time => format(parseISO(time), 'HH:mm')),
    datasets: [{
      label: 'Precipitation (mm)',
      data: next24Precipitation,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} mm`
        }
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Precipitation (mm)'
        },
        ticks: {
          callback: (value: number) => `${value.toFixed(1)} mm`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="glass-card">
      <div className="p-3">
        <h3 className="text-center mb-3">24-Hour Precipitation Forecast</h3>
      </div>
      <div style={{ height: '300px', padding: '20px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PrecipitationChart;

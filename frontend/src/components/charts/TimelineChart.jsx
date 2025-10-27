import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ data, timeRange, type = 'count' }) => {
  // Transform data for the chart
  const chartData = Object.entries(data).map(([date, value]) => ({
    date,
    count: typeof value === 'number' ? value : Object.values(value).reduce((a, b) => a + b, 0),
    ...(typeof value === 'object' && value)
  })).slice(-30); // Last 30 entries

  if (chartData.length === 0) {
    return (
      <div className="text-center py-4 text-muted">
        No timeline data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#8884d8" 
          strokeWidth={2}
          name="Memories"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
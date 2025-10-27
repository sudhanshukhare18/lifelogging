import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EmotionChart = ({ data, loading }) => {
  // Default data if no stats available
  const defaultData = [
    { name: 'neutral', value: 1, color: '#6c757d' }
  ];

  const emotionColors = {
    joy: '#28a745',
    sadness: '#007bff',
    anger: '#dc3545', 
    fear: '#ffc107',
    surprise: '#17a2b8',
    disgust: '#6c757d',
    neutral: '#f8f9fa'
  };

  const chartData = Object.keys(data).length > 0 
    ? Object.entries(data).map(([emotion, count]) => ({
        name: emotion,
        value: count,
        color: emotionColors[emotion] || '#6c757d'
      }))
    : defaultData;

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EmotionChart;
import React, { useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap'; // Removed unused Button
import { useMemories } from '../hooks/useMemories';
import { useEmotionStats } from '../hooks/useEmotionStats';
import EmotionChart from '../components/charts/EmotionChart';
import TimelineChart from '../components/charts/TimelineChart';
import StatsOverview from '../components/charts/StatsOverview';

const Analytics = () => {
  const { memories } = useMemories();
  const { stats, loading: statsLoading } = useEmotionStats();
  const [timeRange, setTimeRange] = useState('month');

  // Calculate additional statistics
  const memoryCountByDate = memories.reduce((acc, memory) => {
    const date = new Date(memory.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const emotionTrends = memories.reduce((acc, memory) => {
    const date = new Date(memory.created_at).toLocaleDateString();
    if (!acc[date]) acc[date] = {};
    acc[date][memory.emotion] = (acc[date][memory.emotion] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="analytics-page">
      <Row className="mb-4">
        <Col>
          <StatsOverview memories={memories} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Memory Timeline</h5>
              <Form.Select 
                style={{ width: 'auto' }}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </Form.Select>
            </Card.Header>
            <Card.Body>
              <TimelineChart 
                data={memoryCountByDate}
                timeRange={timeRange}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Emotion Distribution</h5>
            </Card.Header>
            <Card.Body>
              <EmotionChart data={stats} loading={statsLoading} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Emotion Trends</h5>
            </Card.Header>
            <Card.Body>
              <TimelineChart 
                data={emotionTrends}
                timeRange={timeRange}
                type="emotion"
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Insights & Patterns</h5>
            </Card.Header>
            <Card.Body>
              <div className="insights-container">
                <h6>📈 Your Memory Patterns</h6>
                <ul className="list-unstyled">
                  <li>• Most active day: {getMostActiveDay(memoryCountByDate)}</li>
                  <li>• Dominant emotion: {getDominantEmotion(stats)}</li>
                  <li>• Average memories per day: {calculateAverageMemories(memoryCountByDate)}</li>
                </ul>
                
                <h6 className="mt-3">💡 Suggestions</h6>
                <p className="text-muted small">
                  Based on your patterns, try writing more in the morning 
                  when you're most reflective.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Helper functions
const getMostActiveDay = (memoryCountByDate) => {
  const entries = Object.entries(memoryCountByDate);
  if (entries.length === 0) return 'No data';
  
  const mostActive = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  return new Date(mostActive[0]).toLocaleDateString();
};

const getDominantEmotion = (stats) => {
  const entries = Object.entries(stats);
  if (entries.length === 0) return 'No data';
  
  const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  return dominant[0];
};

const calculateAverageMemories = (memoryCountByDate) => {
  const counts = Object.values(memoryCountByDate);
  if (counts.length === 0) return 0;
  
  const average = counts.reduce((a, b) => a + b, 0) / counts.length;
  return average.toFixed(1);
};

export default Analytics;
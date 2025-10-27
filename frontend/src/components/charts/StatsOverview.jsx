import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const StatsOverview = ({ memories }) => {
  const totalMemories = memories.length;
  const todayMemories = memories.filter(memory => {
    const today = new Date().toDateString();
    return new Date(memory.created_at).toDateString() === today;
  }).length;

  const emotionsCount = memories.reduce((acc, memory) => {
    acc[memory.emotion] = (acc[memory.emotion] || 0) + 1;
    return acc;
  }, {});

  const dominantEmotion = Object.keys(emotionsCount).reduce((a, b) => 
    emotionsCount[a] > emotionsCount[b] ? a : b, 'neutral'
  );

  return (
    <Row>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <div className="stats-number text-primary">{totalMemories}</div>
            <div className="stats-label">Total Memories</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <div className="stats-number text-success">{todayMemories}</div>
            <div className="stats-label">Today</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <div className="stats-number text-info">
              {Object.keys(emotionsCount).length}
            </div>
            <div className="stats-label">Emotions</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <div className="stats-number text-warning" style={{ textTransform: 'capitalize' }}>
              {dominantEmotion}
            </div>
            <div className="stats-label">Dominant Mood</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// Make sure this is a default export
export default StatsOverview;
import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useMemories } from '../hooks/useMemories';
import { useEmotionStats } from '../hooks/useEmotionStats';
import MemoryGrid from '../components/memories/MemoryGrid';
import EmotionChart from '../components/charts/EmotionChart';
import StatsOverview from '../components/charts/StatsOverview';
import MemoryForm from '../components/memories/MemoryForm';

const Dashboard = () => {
  const { memories, loading, createMemory } = useMemories();
  const { stats, loading: statsLoading } = useEmotionStats();
  const [showMemoryForm, setShowMemoryForm] = React.useState(false);

  const recentMemories = memories.slice(0, 6);

  return (
    <div className="dashboard-page">
      {/* Quick Stats Row */}
      <Row className="mb-4">
        <Col>
          <StatsOverview memories={memories} />
        </Col>
      </Row>

      {/* Main Content Row */}
      <Row>
        {/* Memories Section */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Memories</h5>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowMemoryForm(true)}
              >
                ➕ New Memory
              </Button>
            </Card.Header>
            <Card.Body>
              <MemoryGrid 
                memories={recentMemories} 
                loading={loading}
                compact={true}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Emotion Analytics */}
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

      {/* Memory Creation Modal */}
      <MemoryForm 
        show={showMemoryForm}
        onHide={() => setShowMemoryForm(false)}
        onSubmit={createMemory}
      />
    </div>
  );
};

export default Dashboard;
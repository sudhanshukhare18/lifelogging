import React from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import MemoryCard from './MemoryCard'; // Make sure this is a default import

const MemoryGrid = ({ memories, loading, error, compact = false, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h5>No memories found</h5>
        <p>Start by creating your first memory!</p>
      </div>
    );
  }

  return (
    <Row>
      {memories.map((memory) => (
        <Col 
          key={memory.id} 
          lg={compact ? 6 : 4} 
          md={compact ? 6 : 6} 
          className="mb-4"
        >
          <MemoryCard 
            memory={memory} 
            compact={compact}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
};

export default MemoryGrid;
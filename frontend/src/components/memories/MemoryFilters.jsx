import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const MemoryFilters = ({ filters, onFiltersChange }) => {
  const emotions = [
    { value: 'joy', label: '😊 Joy' },
    { value: 'sadness', label: '😢 Sadness' },
    { value: 'anger', label: '😠 Anger' },
    { value: 'fear', label: '😨 Fear' },
    { value: 'surprise', label: '😲 Surprise' },
    { value: 'disgust', label: '🤢 Disgust' },
    { value: 'neutral', label: '😐 Neutral' },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Row className="mb-3 g-2">
      <Col md={3}>
        <Form.Group>
          <Form.Label>Emotion</Form.Label>
          <Form.Select
            value={filters.emotion || ''}
            onChange={(e) => handleFilterChange('emotion', e.target.value)}
          >
            <option value="">All Emotions</option>
            {emotions.map(emotion => (
              <option key={emotion.value} value={emotion.value}>
                {emotion.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      
      <Col md={3}>
        <Form.Group>
          <Form.Label>Sort By</Form.Label>
          <Form.Select
            value={filters.ordering || '-created_at'}
            onChange={(e) => handleFilterChange('ordering', e.target.value)}
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="emotion_intensity">Emotion Intensity</option>
            <option value="title">Title A-Z</option>
          </Form.Select>
        </Form.Group>
      </Col>
      
      <Col md={3}>
        <Form.Group>
          <Form.Label>Date From</Form.Label>
          <Form.Control
            type="date"
            value={filters.created_after || ''}
            onChange={(e) => handleFilterChange('created_after', e.target.value)}
          />
        </Form.Group>
      </Col>
      
      <Col md={3}>
        <Form.Group>
          <Form.Label>Date To</Form.Label>
          <Form.Control
            type="date"
            value={filters.created_before || ''}
            onChange={(e) => handleFilterChange('created_before', e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default MemoryFilters;
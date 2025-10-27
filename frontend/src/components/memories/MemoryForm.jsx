import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { memoryAPI } from '../../services/api';

const MemoryForm = ({ show, onHide, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    content: '',
    emotion: 'neutral',
    emotion_intensity: 0.5,
    location: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const emotions = [
    { value: 'joy', label: '😊 Joy', color: 'success' },
    { value: 'sadness', label: '😢 Sadness', color: 'primary' },
    { value: 'anger', label: '😠 Anger', color: 'danger' },
    { value: 'fear', label: '😨 Fear', color: 'warning' },
    { value: 'surprise', label: '😲 Surprise', color: 'info' },
    { value: 'disgust', label: '🤢 Disgust', color: 'secondary' },
    { value: 'neutral', label: '😐 Neutral', color: 'light' },
  ];

  const handleAnalyzeEmotion = async () => {
    if (!formData.content.trim()) return;
    
    setAnalyzing(true);
    setError('');
    
    try {
      const response = await memoryAPI.analyzeEmotion(formData.content);
      const { emotion, intensity } = response.data;
      
      setFormData(prev => ({
        ...prev,
        emotion,
        emotion_intensity: intensity
      }));
    } catch (err) {
      setError('Failed to analyze emotion');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await onSubmit(formData);
      onHide();
      setFormData({
        title: '',
        content: '',
        emotion: 'neutral',
        emotion_intensity: 0.5,
        location: '',
      });
    } catch (err) {
      setError('Failed to save memory');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Memory' : 'Create New Memory'}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's this memory about?"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your experience in detail..."
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where did this happen?"
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Emotion Analysis</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAnalyzeEmotion}
                      disabled={analyzing || !formData.content.trim()}
                    >
                      {analyzing ? 'Analyzing...' : 'Auto-Detect'}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Emotion</Form.Label>
                    <Form.Select
                      value={formData.emotion}
                      onChange={(e) => setFormData(prev => ({ ...prev, emotion: e.target.value }))}
                    >
                      {emotions.map(emotion => (
                        <option key={emotion.value} value={emotion.value}>
                          {emotion.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Intensity: {Math.round(formData.emotion_intensity * 100)}%
                    </Form.Label>
                    <Form.Range
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.emotion_intensity}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emotion_intensity: parseFloat(e.target.value) 
                      }))}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Update' : 'Create'} Memory
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MemoryForm;
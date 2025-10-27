import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const EmotionBadge = ({ emotion, intensity }) => {
  const emotionColors = {
    joy: 'success',
    sadness: 'primary', 
    anger: 'danger',
    fear: 'warning',
    surprise: 'info',
    disgust: 'secondary',
    neutral: 'light'
  };

  const emotionEmojis = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐'
  };

  return (
    <Badge bg={emotionColors[emotion] || 'light'} text="dark">
      {emotionEmojis[emotion]} {emotion} ({Math.round(intensity * 100)}%)
    </Badge>
  );
};

const MemoryCard = ({ memory, compact = false, onEdit, onDelete }) => {
  return (
    <Card className={`memory-card h-100 ${compact ? 'compact' : ''}`}>
      {memory.image && (
        <Card.Img variant="top" src={memory.image} alt={memory.title} />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className={compact ? 'h6' : 'h5'}>{memory.title}</Card.Title>
          <EmotionBadge 
            emotion={memory.emotion} 
            intensity={memory.emotion_intensity} 
          />
        </div>
        
        <Card.Text className="flex-grow-1">
          {memory.content}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="mb-2">
            {memory.tags?.map((tag, index) => (
              <Badge key={index} bg="outline-secondary" className="me-1" text="dark">
                {tag.tag}
              </Badge>
            ))}
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {new Date(memory.created_at).toLocaleDateString()}
            </small>
            <div>
              {onEdit && (
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(memory)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="outline-danger" size="sm" className="ms-1" 
                  onClick={() => onDelete(memory.id)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Make sure this is a default export
export default MemoryCard;
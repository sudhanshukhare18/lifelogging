import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useMemories } from '../hooks/useMemories';
import MemoryGrid from '../components/memories/MemoryGrid';
import MemoryForm from '../components/memories/MemoryForm';
import MemoryFilters from '../components/memories/MemoryFilters';

const Memories = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  const { 
    memories, 
    loading, 
    error, 
    searchMemories, 
    createMemory, 
    updateMemory, 
    deleteMemory 
  } = useMemories(filters);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMemories(searchQuery);
  };

  const handleCreateMemory = async (memoryData) => {
    await createMemory(memoryData);
    setShowMemoryForm(false);
  };

  const handleUpdateMemory = async (memoryData) => {
    await updateMemory(editingMemory.id, memoryData);
    setEditingMemory(null);
  };

  const handleEditMemory = (memory) => {
    setEditingMemory(memory);
  };

  const handleDeleteMemory = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(id);
    }
  };

  return (
    <div className="memories-page">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">All Memories</h4>
              <Button 
                variant="primary"
                onClick={() => setShowMemoryForm(true)}
              >
                ➕ Add New Memory
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Search Bar */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form onSubmit={handleSearch}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search memories by content, title, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button variant="outline-secondary" type="submit">
                        🔍 Search
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
                <Col md={6}>
                  <div className="text-end text-muted">
                    {memories.length} memories found
                  </div>
                </Col>
              </Row>

              {/* Filters */}
              <MemoryFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Memories Grid */}
              <MemoryGrid 
                memories={memories}
                loading={loading}
                error={error}
                onEdit={handleEditMemory}
                onDelete={handleDeleteMemory}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Memory Creation Modal */}
      <MemoryForm 
        show={showMemoryForm}
        onHide={() => setShowMemoryForm(false)}
        onSubmit={handleCreateMemory}
      />

      {/* Memory Edit Modal */}
      <MemoryForm 
        show={!!editingMemory}
        onHide={() => setEditingMemory(null)}
        onSubmit={handleUpdateMemory}
        initialData={editingMemory}
      />
    </div>
  );
};

export default Memories;
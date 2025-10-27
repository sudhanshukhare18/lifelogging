import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Settings = () => {
  const [settings, setSettings] = useState({
    autoEmotionDetection: true,
    emailNotifications: false,
    dailyReminders: true,
    theme: 'light',
    language: 'en',
  });
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    // In a real app, you'd send this to your backend
    localStorage.setItem('lifelogging-settings', JSON.stringify(settings));
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      autoEmotionDetection: true,
      emailNotifications: false,
      dailyReminders: true,
      theme: 'light',
      language: 'en',
    };
    setSettings(defaultSettings);
    setSaveStatus('Settings reset to defaults!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="settings-page">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Application Settings</h4>
            </Card.Header>
            <Card.Body>
              {saveStatus && (
                <Alert variant="success">{saveStatus}</Alert>
              )}

              <Form>
                <h5 className="mb-3">AI Features</h5>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="auto-emotion-detection"
                    label="Automatic Emotion Detection"
                    checked={settings.autoEmotionDetection}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      autoEmotionDetection: e.target.checked
                    }))}
                  />
                  <Form.Text className="text-muted">
                    Automatically detect emotions from your memory content using AI
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />
                
                <h5 className="mb-3">Notifications</h5>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Email Notifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      emailNotifications: e.target.checked
                    }))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="daily-reminders"
                    label="Daily Reminders"
                    checked={settings.dailyReminders}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      dailyReminders: e.target.checked
                    }))}
                  />
                  <Form.Text className="text-muted">
                    Send reminders to log your daily memories
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />
                
                <h5 className="mb-3">Appearance</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    value={settings.theme}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      theme: e.target.value
                    }))}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      language: e.target.value
                    }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Data Management</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  📤 Export All Memories
                </Button>
                <Button variant="outline-warning">
                  🗑️ Delete All Memories
                </Button>
                <Button variant="outline-danger">
                  🔄 Reset Account
                </Button>
              </div>
              
              <div className="mt-4">
                <h6>Storage Usage</h6>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar" 
                    style={{ width: '45%' }}
                  >
                    45%
                  </div>
                </div>
                <small className="text-muted">
                  45MB of 100MB used
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
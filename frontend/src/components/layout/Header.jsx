import React from 'react';
import { Navbar, Nav, Form, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-header">
      <Button 
        variant="outline-light" 
        className="sidebar-toggle me-3"
        onClick={onToggleSidebar}
      >
        ☰
      </Button>
      
      <Navbar.Brand href="#dashboard" className="d-flex align-items-center">
        <span className="brand-icon">🧠</span>
        <span className="brand-text">LifeLogging AI</span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Form className="d-flex mx-auto" style={{ width: '400px' }}>
          <Form.Control
            type="search"
            placeholder="Search memories semantically..."
            className="me-2"
          />
          <Button variant="outline-light">
            🔍 Search
          </Button>
        </Form>
        
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="user-dropdown">
              👤 {user?.username}
            </Dropdown.Toggle>
            
            <Dropdown.Menu>
              <Dropdown.Item href="#profile">Profile</Dropdown.Item>
              <Dropdown.Item href="#settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                🚪 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
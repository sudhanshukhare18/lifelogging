import React, { useState } from 'react';
import { Container } from 'react-bootstrap'; // Removed unused Row, Col
import Header from './Header';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/App.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-content">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`content-area ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Container fluid>
            {children}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    { icon: '🏠', label: 'Dashboard', href: '#dashboard' },
    { icon: '📔', label: 'Memories', href: '#memories' },
    { icon: '📊', label: 'Analytics', href: '#analytics' },
    { icon: '⚙️', label: 'Settings', href: '#settings' },
  ];

  return (
    <div className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <Nav className="flex-column sidebar-nav">
        {menuItems.map((item, index) => (
          <Nav.Link 
            key={index} 
            href={item.href}
            className="sidebar-nav-link"
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Nav.Link>
        ))}
        
        <div className="sidebar-divider"></div>
        
        <Nav.Link href="#new-memory" className="sidebar-nav-link new-memory-btn">
          <span className="nav-icon">➕</span>
          {!collapsed && <span className="nav-label">New Memory</span>}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
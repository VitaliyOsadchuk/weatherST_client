import React, { useEffect, useRef, useState } from 'react';
import './css/Sidebar.css';

function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setExpanded(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        expanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expanded]);

  return (
    <div
      className={`sidebar ${expanded ? 'expanded' : ''}`}
      ref={sidebarRef}
    >
      <div
        className={`sidebar-header ${expanded ? 'expanded' : 'collapsed'}`}
      >
        <button className="toggle-btn" onClick={toggleSidebar}>
          {expanded ? '✕' : '≡'}
        </button>
      </div>

      {expanded && (
        <ul className="menu-items">
            <li><a href="/" className="lang">Вуличний модуль</a></li>
            <li><a href="/" className="lang">Голоsвна</a></li>
            <li><a href="/" className="lang">Головна</a></li>
            <li><a href="/" className="lang">Головна</a></li>
        </ul>
        
      )}
    </div>
  );
}

export default Sidebar;

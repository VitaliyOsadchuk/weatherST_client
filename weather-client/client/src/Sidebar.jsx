import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setExpanded(prev => !prev);
  };

  // Автоматичне згортання при кліку поза розгорнутим меню
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

  // Обробник кліку по згорнутій панелі
  const handleSidebarClick = (e) => {
    if (!expanded) {
      setExpanded(true);
    }
  };

  return (
    <div
      className={`sidebar ${expanded ? 'expanded' : ''}`}
      ref={sidebarRef}
      onClick={handleSidebarClick} // ← додаємо цей обробник
    >
      <div
        className={`sidebar-header ${expanded ? 'expanded' : 'collapsed'}`}
        onClick={(e) => {
          e.stopPropagation(); // щоб не спрацьовував handleSidebarClick
          toggleSidebar();
        }}
      >
        <button className="toggle-btn">
          {expanded ? '✕' : '≡'}
        </button>
      </div>

      {expanded && (
        <ul className="menu-items">
          <li><a href="/" className="lang">Головна</a></li>
          <li><a href="/IndoorModule" className="lang">Кімнатний модуль</a></li>
          <li><a href="/OutdoorModule" className="lang">Вуличний модуль</a></li>
          <li><a href="/forecast" className="lang">Прогнозування</a></li>
        </ul>
      )}
    </div>
  );
}

export default Sidebar;

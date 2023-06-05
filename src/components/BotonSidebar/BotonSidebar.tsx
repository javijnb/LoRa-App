import React from 'react';
import './BotonSidebar.css'

interface BotonSidebarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onToggle: () => void;
}

const BotonSidebar = ({ onToggle, children }: BotonSidebarProps) => {
  const handleClick = () => {
    onToggle();
  };

  return (
    <button onClick={handleClick} className="boton-sidebar btn"><i className="fa fa-bars"></i>
      {children}
    </button>
  );
};

export default BotonSidebar;
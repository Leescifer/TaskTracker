import React from 'react';
import { AlignJustify, X } from 'lucide-react';

const MenuButton = ({ open, onClick }) => {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {open ? <X size={32} color="#ffffff" /> : <AlignJustify size={32} color="#31578B" />}

    </button>
  );
};

export default MenuButton;
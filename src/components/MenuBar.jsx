import React, { useState } from 'react';

function MenuBar({ openPopup }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="menu-bar">
            <div className="menu-item" onClick={toggleDropdown}>
                File
                {showDropdown && (
                    <div className="dropdown">
                        <button onClick={openPopup}>Page Layout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MenuBar;

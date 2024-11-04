// src/components/AdminNav.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="hamburger-menu" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`admin-nav ${isOpen ? 'open' : ''}`}>
                <h2>管理メニュー</h2>
                <ul>
                    <li><Link to="/admin/slots">予約枠管理</Link></li>
                    <li><Link to="/admin/patterns">パターン管理</Link></li>
                    <li><Link to="/admin/reservations">予約管理</Link></li>
                </ul>
            </nav>
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default AdminNav;

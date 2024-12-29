import React from 'react';
import "../styles/AdminHeader.scss";
import logo from '../assets/images/logo.png';

const AdminHeader = ({ isOpen, toggleMenu }) => {
    return (
        <header className="admin-header">
            <div>
                <img src={logo} className='logo' alt="美山お香のロゴ" />
                <span>美山お香　予約管理画面</span>
            </div>
            <button className="hamburger-menu" onClick={toggleMenu}>
                {isOpen ? "×" : "☰"}
            </button>
        </header>
    );
};

export default AdminHeader;

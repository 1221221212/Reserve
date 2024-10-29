// src/components/AdminNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => (
    <nav>
        <ul>
            <li><Link to="/admin/slots">予約枠管理</Link></li>
            <li><Link to="/admin/reservations">予約管理</Link></li>
        </ul>
    </nav>
);

export default AdminNav;

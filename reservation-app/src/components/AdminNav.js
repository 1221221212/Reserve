import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // 現在のパスを取得

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // メニューアイテムに選択されているクラスを追加
    const getLinkClass = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <>
            <button className="hamburger-menu" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`admin-nav ${isOpen ? 'open' : ''}`}>
                <h2>管理メニュー</h2>
                <ul>
                    <li>
                        <Link to="/admin/slots" className={getLinkClass('/admin/slots')}>受付管理</Link>
                        <ul>
                            <li><Link to="/admin/slots" className={getLinkClass('/admin/slots')}>予約枠管理</Link></li>
                            <li><Link to="/admin/patterns" className={getLinkClass('/admin/patterns')}>パターン管理</Link></li>
                            <li><Link to="/admin/close" className={getLinkClass('/admin/close')}>休業日管理</Link></li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/admin/reservations" className={getLinkClass('/admin/reservations')}>予約管理</Link>
                    </li>
                    <li>
                        <Link to="/admin/settings/info" className={getLinkClass('/admin/settings')}>設定</Link>
                        <ul>
                            <li><Link to="/admin/settings/info" className={getLinkClass('/admin/settings/info')}>基本情報設定</Link></li>
                            <li><Link to="/admin/settings/reservation" className={getLinkClass('/admin/settings/reservation')}>予約設定</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default AdminNav;

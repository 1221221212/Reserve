import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // メニューの親子構造
    const menuItems = [
        {
            parent: 'カレンダー',
            path: '/admin/calendar',
        },
        {
            parent: '受付管理',
            path: '/admin/slots',
            defaultChild: '/admin/slots',
            children: [
                { name: '予約枠管理', path: '/admin/slots' },
                { name: 'パターン管理', path: '/admin/patterns' },
                { name: '休業日管理', path: '/admin/close' },
            ],
        },
        {
            parent: '予約管理',
            path: '/admin/reservations',
            defaultChild: '/admin/reservations',
            children: [],
        },
        {
            parent: '設定',
            path: '/admin/settings',
            defaultChild: '/admin/settings/info',
            children: [
                { name: '基本情報設定', path: '/admin/settings/info' },
                { name: '予約設定', path: '/admin/settings/reservation' },
            ],
        },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen); // メニューを開閉
    };

    const handleParentSelect = (menu) => {
        setIsOpen(false); // メニューを閉じる
        navigate(menu.children?.length > 0 ? menu.defaultChild : menu.path); // 子メニューがない場合は直接親のpathへ
    };

    const getLinkClass = (menu) => {
        // 親メニューのパスまたは子メニューのパスが一致している場合に "active"
        if (location.pathname.startsWith(menu.path)) {
            return 'active';
        }
        if (menu.children?.some((child) => location.pathname.startsWith(child.path))) {
            return 'active';
        }
        return '';
    };

    return (
        <>
            <button className="hamburger-menu" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`admin-nav ${isOpen ? 'open' : ''}`}>
                <h2>管理メニュー</h2>
                <ul>
                    {menuItems.map((menu) => (
                        <li key={menu.parent}>
                            <button
                                className={`parent-item ${getLinkClass(menu)}`}
                                onClick={() => handleParentSelect(menu)}
                            >
                                {menu.parent}
                            </button>
                            {getLinkClass(menu) === 'active' && menu.children?.length > 0 && (
                                <ul className="child-menu">
                                    {menu.children.map((child) => (
                                        <li key={child.path}>
                                            <Link to={child.path} className={getLinkClass({ path: child.path })}>
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default AdminNav;

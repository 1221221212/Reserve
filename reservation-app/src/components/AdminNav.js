import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // メニューの開閉状態を管理
    const [selectedParent, setSelectedParent] = useState('');

    // メニューの親子構造
    const menuItems = [
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

    useEffect(() => {
        const currentParent = menuItems.find((menu) =>
            menu.children.some((child) => location.pathname.startsWith(child.path)) || 
            location.pathname === menu.defaultChild
        );
        if (currentParent) {
            setSelectedParent(currentParent.parent);
        }
    }, [location.pathname, menuItems]);

    const toggleMenu = () => {
        setIsOpen(!isOpen); // メニューを開閉
    };

    const handleParentSelect = (menu) => {
        setSelectedParent(menu.parent);
        setIsOpen(false); // メニューを閉じる
        navigate(menu.defaultChild);
    };

    const getLinkClass = (path) => {
        return location.pathname.startsWith(path) ? 'active' : '';
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
                                className={`parent-item ${selectedParent === menu.parent ? 'active' : ''}`}
                                onClick={() => handleParentSelect(menu)}
                            >
                                {menu.parent}
                            </button>
                            {selectedParent === menu.parent && menu.children.length > 0 && (
                                <ul className="child-menu">
                                    {menu.children.map((child) => (
                                        <li key={child.path}>
                                            <Link to={child.path} className={getLinkClass(child.path)}>
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

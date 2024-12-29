import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNav = ({ isOpen, toggleMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // メニュー構造
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

    // リンクのアクティブ状態を判定
    const getLinkClass = (menu) => {
        if (location.pathname.startsWith(menu.path)) {
            return 'active';
        }
        if (menu.children?.some((child) => location.pathname.startsWith(child.path))) {
            return 'active';
        }
        return '';
    };

    // ナビゲーション描画
    return (
        <nav className={`admin-nav ${isOpen ? 'open' : ''}`}>
            <ul>
                {menuItems.map((menu) => (
                    <li key={menu.parent}>
                        <button
                            className={`parent-item ${getLinkClass(menu)}`}
                            onClick={() => {
                                toggleMenu();
                                navigate(menu.children?.length > 0 ? menu.defaultChild : menu.path);
                            }}
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
    );
};

export default AdminNav;

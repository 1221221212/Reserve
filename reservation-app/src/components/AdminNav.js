import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import menuItems from '../data/menuItems';

const AdminNav = ({ isOpen, toggleMenu, setActiveMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        let activeParent = null;
        let activeChild = null;

        menuItems.forEach((menu) => {
            if (location.pathname.startsWith(menu.path)) {
                activeParent = menu;
                menu.children?.forEach((child) => {
                    if (location.pathname === child.path) { // 完全一致
                        activeChild = child;
                    }
                });
            }
        });

        setActiveMenu({ activeParent, activeChild });
    }, [location, setActiveMenu]);

    return (
        <nav className={`admin-nav ${isOpen ? 'open' : ''}`}>
            <ul>
                {menuItems.map((menu) => (
                    <li key={menu.parent}>
                        <button
                            className={`parent-item ${location.pathname.startsWith(menu.path) ? 'active' : ''}`}
                            onClick={() => {
                                toggleMenu();
                                navigate(menu.defaultChild || menu.path);
                            }}
                        >
                            {menu.parent}
                        </button>
                        {menu.children?.length > 0 && (
                            <ul className="child-menu">
                                {menu.children.map((child) => (
                                    <li key={child.path}>
                                        <Link
                                            to={child.path}
                                            className={location.pathname === child.path ? 'active' : ''}
                                            onClick={toggleMenu} // 子メニュー選択時にナビゲーションを閉じる
                                        >
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

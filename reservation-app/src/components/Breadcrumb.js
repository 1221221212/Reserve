import React from 'react';

const Breadcrumb = ({ activeMenu }) => {
    const { activeParent, activeChild } = activeMenu;

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <a href="/admin">管理画面</a>
                </li>
                {activeParent && (
                    <li>
                        {activeChild ? (
                            <a href={activeParent.path}>{activeParent.parent}</a>
                        ) : (
                            <span>{activeParent.parent}</span>
                        )}
                    </li>
                )}
                {activeChild && (
                    <li>
                        <span>{activeChild.name}</span>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Breadcrumb;

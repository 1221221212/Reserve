import React from 'react';

const AdminPage = ({ token }) => {
    return (
        <div>
            <h2>管理画面</h2>
            {/* 管理者の操作に関するコンテンツをここに追加 */}
            <p>トークン: {token}</p>
        </div>
    );
};

export default AdminPage;

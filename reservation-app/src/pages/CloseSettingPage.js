import React from 'react';
import { useNavigate } from 'react-router-dom';
import CloseForm from '../components/CloseForm';

const CloseSettingPage = () => {
    const navigate = useNavigate();

    const handleClosedDaySaved = () => {
        // 休業日作成後に休業日管理ページに遷移
        navigate('/admin/close');
    };

    return (
        <div>
            <h1>休業日を設定</h1>
            <CloseForm onClosedDaySaved={handleClosedDaySaved} />
        </div>
    );
};

export default CloseSettingPage;

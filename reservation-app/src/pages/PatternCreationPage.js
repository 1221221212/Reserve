// src/pages/PatternCreationPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatternForm from '../components/PatternForm';

const PatternCreationPage = () => {
    const navigate = useNavigate();

    const handlePatternSaved = () => {
        // パターン作成後にパターン管理ページに遷移
        navigate('/admin/patterns');
    };

    return (
        <div>
            <h1>新しいパターンを作成</h1>
            <PatternForm onPatternSaved={handlePatternSaved} />
        </div>
    );
};

export default PatternCreationPage;

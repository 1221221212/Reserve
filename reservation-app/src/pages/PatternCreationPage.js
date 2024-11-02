// src/pages/PatternCreationPage.js
import React from 'react';
import PatternForm from '../components/PatternForm';

const PatternCreationPage = () => {
    const handlePatternSaved = () => {
        // 要対応！！必要に応じて他の処理（リダイレクトやリフレッシュなど）
    };

    return (
        <div>
            <h1>新しいパターンを作成</h1>
            <PatternForm onPatternSaved={handlePatternSaved} />
        </div>
    );
};

export default PatternCreationPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseForm from '../components/CloseForm';
import ConfirmCloseConflict from '../components/ConfirmCloseConflict';
import axios from 'axios';

const CloseSettingsPage = () => {
    const [conflicts, setConflicts] = useState([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [formData, setFormData] = useState(null); // フォームデータを一時保存
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleFormSubmit = async (payload) => {
        try {
            // 競合チェック
            const conflictResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/closed-days/check-conflicts`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // 競合データを取得
            const conflicts = conflictResponse.data.conflicts;
    
            // 競合があるか確認
            if (Object.keys(conflicts).length > 0) {
                // 競合がある場合
                setConflicts(conflicts); // 競合データを状態に保存
                setFormData(payload);   // 確認後に再利用するため保存
                setIsConfirming(true);  // 確認モードに移行
            } else {
                // 競合がない場合、直接休業日を作成
                await createClosedDay(payload);
            }
        } catch (error) {
            console.error('Failed to check conflicts:', error);
            alert(`競合チェックに失敗しました: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleConfirmConflict = async () => {
        try {
            // 競合データからスロットIDを抽出
            const slotIds = Object.values(conflicts).flat();
    
            // スロットを "Closed" に更新
            if (slotIds.length > 0) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/assigned-slots/status`,
                    {
                        slotIds,
                        status: 'close'
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
    
            // 休業日作成処理を呼び出し
            const payloadWithResolution = { ...formData, conflictResolved: true };
            await createClosedDay(payloadWithResolution);
    
            alert('競合が解決され、休業日が作成されました');
        } catch (error) {
            console.error('Failed to resolve conflicts and close slots:', error);
            alert(`競合解決に失敗しました: ${error.response?.data?.error || error.message}`);
        } finally {
            // 状態をリセット
            setConflicts([]);
            setIsConfirming(false);
        }
    };

    const createClosedDay = async (payload) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/closed-days`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('休業日が作成されました');
            navigate('/admin/close');
        } catch (error) {
            console.error('Failed to create closed day:', error);
            alert('休業日の作成に失敗しました');
        }
    };

    const handleCancelConflict = () => {
        setConflicts([]);
        setIsConfirming(false);
        setFormData(null);
    };

    return (
        <div className="close-settings-page">
            <h1>休業日設定</h1>

            {isConfirming ? (
                <ConfirmCloseConflict
                    conflicts={conflicts}
                    onConfirm={handleConfirmConflict}
                    onCancel={handleCancelConflict}
                />
            ) : (
                <CloseForm onClosedDaySaved={handleFormSubmit} />
            )}
        </div>
    );
};

export default CloseSettingsPage;

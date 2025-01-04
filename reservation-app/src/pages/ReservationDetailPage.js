// src/pages/ReservationDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReservationDetail.scss';

const ReservationDetailPage = () => {
    const { id } = useParams(); // URLから予約IDを取得
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [comments, setComments] = useState([]); // コメント一覧
    const [newComment, setNewComment] = useState(''); // 新規コメント内容

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('トークンが見つかりません。再度ログインしてください。');
                    navigate('/admin/login'); // トークンがない場合、ログインページにリダイレクト
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReservation(response.data);
            } catch (error) {
                console.error('予約詳細の取得に失敗しました:', error);
            }
        };

        fetchReservation();
    }, [id, navigate]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/comment/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setComments(response.data.reverse());
            } catch (error) {
                console.error('コメントの取得に失敗しました:', error);
            }
        };

        fetchComments();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('コメントを入力してください。');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/comment`,
                { reservation_id: id, comment: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNewComment(''); // フォームをリセット
            alert('コメントが追加されました。');

            const updatedComments = await axios.get(`${process.env.REACT_APP_API_URL}/comment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComments(updatedComments.data.reverse());
        } catch (error) {
            console.error('コメントの投稿に失敗しました:', error);
            alert('コメントの投稿に失敗しました。もう一度お試しください。');
        }
    };

    const handleCancelReservation = async () => {
        if (!window.confirm('本当にこの予約をキャンセルしますか？')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('トークンが見つかりません。再度ログインしてください。');
                navigate('/admin/login');
                return;
            }

            await axios.patch(`${process.env.REACT_APP_API_URL}/reservations/${id}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            alert('予約をキャンセルしました。');
            navigate('/admin/reservations'); // 一覧ページへリダイレクト
        } catch (error) {
            console.error('予約のキャンセルに失敗しました:', error);
            alert('予約のキャンセルに失敗しました。もう一度お試しください。');
        }
    };

    if (!reservation) return <div>Loading...</div>;

    return (
        <div className='reservation-detail-wrap'>
            <div className="reservation-detail">
                <p>予約詳細</p>
                <div className="reservation-field">
                    <span className="label">予約者名:</span>
                    <span className="value">{reservation.customer_name}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">人数:</span>
                    <span className="value">{reservation.group_size}人</span>
                </div>
                <div className="reservation-field">
                    <span className="label">電話番号:</span>
                    <span className="value">{reservation.phone_number}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">メールアドレス:</span>
                    <span className="value">{reservation.email}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">予約ID:</span>
                    <span className="value">{reservation.reservation_number}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">コメント:</span>
                    <span className="value">{reservation.comment || 'なし'}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">ステータス:</span>
                    <span className="value">{reservation.status}</span>
                </div>
                <div className="reservation-field">
                    <span className="label">予約作成日:</span>
                    <span className="value">{reservation.created_at}</span>
                </div>
                <button className="delete-button" onClick={handleCancelReservation}>
                    予約をキャンセル
                </button>
            </div>
            <div className='admin-comment'>
                <p>コメント一覧</p>
                <ul className="comments-list">
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p><strong>{comment.username}</strong><span className="comment-date"> {new Date(comment.created_at).toLocaleString()}</span></p>
                            <p>{comment.comment}</p>
                        </li>
                    ))}
                </ul>
                <div className="add-comment">
                    <textarea
                        placeholder="新しいコメントを入力"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>コメントを追加</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailPage;

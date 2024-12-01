import React from 'react';

const InfoSettings = ({ storeName, phoneNumber, address, setStoreName, setPhoneNumber, setAddress }) => {
    return (
        <section className="basic-info-section">
            <h2>基本情報</h2>
            <div className="form-row">
                <label>店舗名:</label>
                <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                />
            </div>
            <div className="form-row">
                <label>電話番号:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <div className="form-row">
                <label>住所:</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                ></textarea>
            </div>
        </section>
    );
};

export default InfoSettings;

// src/data/menuItems.js
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
            { name: 'パターン管理', path: '/admin/slots/patterns' },
            { name: '休業日管理', path: '/admin/slots/close' },
        ],
    },
    {
        parent: '予約管理',
        path: '/admin/reservations',
        defaultChild: '/admin/reservations',
        children: [
            { name: '予約リスト', path: '/admin/reservations' },
            { name: '要対応予約', path: '/admin/reservations/action-required' },
        ],
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

export default menuItems;

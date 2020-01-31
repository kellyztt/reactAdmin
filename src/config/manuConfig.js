const menuList = [
    {
        title: '主页',
        icon: 'home',
        key: '/home',
    },
    {
        title: '商品',
        icon:'appstore',
        key:'/products',
        children: [
            {
                title: '品类管理',
                icon: 'appstore',
                key: '/category',
            },
            {
                title: '商品管理',
                icon: 'appstore',
                key: '/products',
            },
        ]
    }
];
export default menuList;
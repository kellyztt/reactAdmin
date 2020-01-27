import store from 'store';
const USER_KEY = 'user_key';

/**
 * 进行Local数据存储管理的工具模块
 */
export default{
    /**
     * 保存user
     */
    saveUer(user){
        //object toString 方法返回‘[object Object]’
        //localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user);
    },
    /**
     * 读取user
     */
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        return store.get(USER_KEY) || {};
    },
    /**
     * 删除user
     */
    removeUser(){
        //localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY);
    }
}
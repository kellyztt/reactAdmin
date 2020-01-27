/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

 import ajax from './ajax';
 
 //login 
 //箭头有返回作用，不用写{return}
 export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST');

 //add user 
 export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');
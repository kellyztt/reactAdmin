/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

import ajax from './ajax';
import { message } from 'antd';
 const BASE = '';
 const weatherUrl = 'https://free-api.heweather.net/s6/weather/now';
 const key = '2cd097eb96c24b21906fa921e241364d';
 //login 
 //箭头有返回作用，不用写{return}
 export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST');

 //add user 
 export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

 //获取分类列表
 export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId:parentId});

 //添加分类
 export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST');

 //更新分类名称
 export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');
 
 /**
  * jsonp请求的接口请求函数
  */
 export const reqWeather = (location) => ajax(weatherUrl, {location,key});

    
 

 
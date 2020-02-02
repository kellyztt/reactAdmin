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

 //获取商品分页列表
 export const reqProducts = (pageNum, pageSize) => ajax(BASE + 'manage/product/list', {pageNum, pageSize})

 /**
  * 搜索商品分页列表
  * @param {*} pageNum 
  * @param {*} pageSize 
  * @param {*} searchName 传入的搜索对象
  * @param {*} searchType 搜索的类型，productName/productDesc
  */
 export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', 
 {pageNum, pageSize,[searchType]:searchName});     //变量值做属性名时，要[]
 
 /**
  * 
  * @param {*} categoryId 根据id获取category 
  */
 export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});

 /**
  * 更新商品的状态（上架/下架）
  */
 export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

 export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST');

 //添加或更新商品
 export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + product._id ? 'update' : 'add', product, 'POST');


 /**
  * jsonp请求的接口请求函数
  */
 export const reqWeather = (location) => ajax(weatherUrl, {location,key});

    
 

 
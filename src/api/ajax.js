/**
 * 发送异步ajax请求的函数模块 
 * 封装axios库
 * 函数返回值是promise对象
 * 优化：统一处理请求异常
 * 在外层包一个自己的promise对象
 * 在请求出错时，不去reject(error)，而是显示错误提示
*/

import axios from 'axios';
import { message } from 'antd';
//只暴露一个的时候用default
//指定一个默认值,防止undefined,形参默认值
export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject) => {    //executor
        //1. 执行异步ajax请求
        let promise;
        if (type === 'GET'){
            promise = axios.get(url, { //配置对象
                params: data
            });
        } else {
            promise = axios.post(url, data);
        }
        //2. 成功了，调用resolve(value)
        promise.then(response => {
            //异步得到的不是response而是response.data
            resolve(response.data);
        //3. 如果失败了，调用reject(reason)会掉入try-catch逻辑，所以不能调用，而是提示异常信息
        }).catch(error => {
            message.error('error: ' + error.message);
        })
        
    })
    
}
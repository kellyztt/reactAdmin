import React, { Component } from 'react';
import './index.less';

/**
 * 外形像链接的按钮
 * @param {} props 
 */
export default function LinkButton(props){
    //把传进来的props一起传给button
    //标签体的内容也会成为属性，如'退出',children属性
    return <button {...props} className='link-button'></button>
}
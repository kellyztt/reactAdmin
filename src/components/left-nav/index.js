import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { Menu, Icon } from 'antd';
import './index.less';

const { SubMenu } = Menu;
export default class LeftNav extends Component{
    render(){
        return (
            <Fragment className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={ logo } alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                >
                    <Menu.Item key="1"><Icon type="home" /><span>首页</span></Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                        <span><Icon type="mail" /><span>商品</span></span>
                    }>
                        <Menu.Item key="2">品类管理</Menu.Item>
                        <Menu.Item key="3">商品管理</Menu.Item>
                       
                    </SubMenu>
                </Menu>
            </Fragment>
            
        )
    }
}
import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { Menu, Icon } from 'antd';
import menuList from '../../config/manuConfig';
import './index.less';

const { SubMenu } = Menu;
class LeftNav extends Component{
    /**
     * 根据menu的数据数组生成对应标签数组
     * map+递归调用
     */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children){
                return (
                    <Menu.Item key={item.key}><Link to={item.key}><Icon type={item.icon} /><span>{item.title}</span></Link></Menu.Item>
                );
            } else {
                return (
                <SubMenu key={item.key} title={
                    <span><Icon type={item.icon} /><span>{item.title}</span></span>
                }>
                    {this.getMenuNodes(item.children)}
                </SubMenu>)
            }
        })
    }
/**
     * 根据menu的数据数组生成对应标签数组
     * reduce+递归调用
     * reduce()做累加
     */
    getMenuNodes = (menuList) => {
        //reduce((上次统计结果，),初始值)
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            //向pre中添加<Menu.Item>
            if (!item.children){
                pre.push((<Menu.Item key={item.key}><Link to={item.key}><Icon type={item.icon} /><span>{item.title}</span></Link></Menu.Item>));
            } else {
                //如果某个item的子item是当前选中的item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
                if (cItem){
                    this.openKey = item.key;
                }
                pre.push((<SubMenu key={item.key} title={
                    <span><Icon type={item.icon} /><span>{item.title}</span></span>
                }>
                    {this.getMenuNodes(item.children)}
                </SubMenu>));
            };
            return pre; //当前统计结果，下一次统计的传入
        },[]);
    }
    //在第一次render前执行一次，为第一次render()准备(同步)，
    //得到所有的nodes，给openKey赋值
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList);
    }
    
    render(){
        //得到当前请求的路由路径
        //这个不是路由组件，没有props.location
        let path = this.props.location.pathname;
        if (path.indexOf('/products') === 0){
            path = '/products';
        }
        const openKey = this.openKey;
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={ logo } alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
            
        )
    }
}
/**
 * withRouter高阶组件:
 * 包装非路由组件，返回一个新的组件，新的组件向非路由组件传递三个属性：
 * history,location,match
 */
export default withRouter(LeftNav);
import React, { Component } from 'react';
import { formateDate } from '../../utils/dateUtils';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { reqWeather } from '../../api';
import LinkButton from '../link-button';
import { withRouter } from 'react-router-dom'; 
import menuList from '../../config/manuConfig';
import { Modal } from 'antd';
import './index.less';

const { confirm } = Modal;

class Header extends Component{
    state = {
        currentTime: formateDate(Date.now()), //当前时间的字符串
        cond_code:'', //天气code.png
        cond_txt:''    //天气的文本
    }

    getTime = () => {
        //每隔1s获取当前时间,并更新状态数据currentTime
        this.intervalID = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime})
        }, 1000);
    }

    getWeather = async () => {
        const result = await reqWeather('nanjing');
        const {cond_code, cond_txt} = result.HeWeather6[0].now;
        this.setState({cond_code, cond_txt});
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if (item.key === path){ //若item的key是当前路径，则title就是所需的title
                title = item.title;
            } else if (item.children){
                const cItem = item.children.find(cItem => cItem.key === path) //find回调函数返回值为boolean
                if (cItem){
                    title = cItem.title;
                }
            }
        });
        return title;
    }
    
    logout = () => {
       confirm({
           title: 'Are you sure to log out?',
           onOk: () => {
            storageUtils.removeUser();
            memoryUtils.user = {};
            this.props.history.replace('/login');
           },
           onCancel(){
               console.log('cancle');
           }
       })
    }

    //在第一次render后执行一次，一般用于执行异步操作，发ajax请求或启动定时器
    componentDidMount(){
        //获取当前时间
        this.getTime();
        //获取当前天气
        this.getWeather();
    }
    //在当前组件卸载之前调用
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.intervalID);
    }

    render(){
        const {currentTime, cond_code, cond_txt} = this.state;
        const username = memoryUtils.user.username;
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={cond_code+'.png'} alt="weather" />
                        <span>{cond_txt}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);
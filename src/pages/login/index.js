import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button, message } from 'antd';
import logo from '../../assets/images/logo.png';
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import './login.less';

/**
 * 维持登录与自动登录
 * 1. 登录后，刷新后仍是已登录状态
 * 2. 登录后，关闭浏览器再打开依然是已登录转台
 * 3. 登录后，访问登录路径会自动跳转到管理界面
 */
const Item = Form.Item;
/**
 * Login page
 */
class Login extends Component {
    handleSubmit = (e) => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            if (!err){
                const { username, password } = values;
                //const result = await reqLogin(username, password);
                //{status: 0, data: user}, {status:0, msg: 'xxx'}
                const result = { status: 0, user: {username: 'admin', _id:'123'}};
                if (result.status ===  0){
                    //登录成功
                    message.success('登录成功');
                    const user = result.user;
                    memoryUtils.user = user; //保存到内存
                    storageUtils.saveUer(user); //保存到Local
                    //跳转到管理界面
                    //不需要回退回登录界面，回退用replace，push
                    this.props.history.replace('/');
                } else {
                    //登录失败
                    message.error(result.msg);
                }
                console.log("请求成功");
            } else {
                console.log('error');
;            }
        });
    }
    validatePwd = (rule, value, callback) => {
        //callback() succeed, callback('***') failed
        if (!value){
            callback('password is required'); 
        } else if (value.length < 4){
            callback('password should have at least four characters')
        } else if (value.length > 12){
            callback('password should have at most 12 characters')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)){          //正则对象.test()
            callback('username should be letter, number or _');
        } else {
            callback();
        }
    }
    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user;
        if (user && user._id){
            return <Redirect to='/' />
        }
        //具有强大功能的form对象
        const form = this.props.form
        const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username',{
                                    //配置对象：属性名是特定的一些名称
                                    //声明式验证：直接使用别人定义好的验证规则进行验证
                                    rules: [
                                {required: true, whitespace: true, message: 'please input username'}, 
                                {min: 4, message:'username should have at least four characters'},
                                {max: 12, message: 'username should have at most 12 characters'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: 'username should be letter, number or _'}]
                                })(<Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />)
                            }
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        {validator: this.validatePwd}
                                    ]
                                })(<Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />)
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in</Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
/**
 * 内部有Form的组件，称为Form组件，
 * 包装Form组件，生成一个新的组件From(Login)
 * 新组件会向Form组件传递一个强大的对象属性: form
 * */
const WrapLogin = Form.create()(Login)
export default WrapLogin;
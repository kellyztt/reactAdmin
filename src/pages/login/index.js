import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from './assets/logo.png'
import './login.less';

const Item = Form.Item;
/**
 * Login page
 */
class Login extends Component {
    handleSubmit = (e) => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行校验
        this.props.form.validateFields((err, values) => {
            if (!err){
                console.log('received values of form: ' + values);
            }
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
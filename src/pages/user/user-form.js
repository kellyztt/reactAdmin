import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd';

const Item = Form.Item;
const Option = Select.Option;
/**添加和修改用户的表单 */
class UserForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    //把form对象传到外面去
    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render(){
        const { roles } = this.props;
        const { getFieldDecorator } = this.props.form;
        const user = this.props.user || {};
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15}
        }
        return (
            <Form {...formItemLayout}>
                <Item label='username'>
                    {
                        //跟接口保持一致
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules:[
                                {required: true, message: 'please input username'}
                            ]
                        })(<Input placeholder='please input username' />)
                    }
                </Item>
                {
                    user._id ? null : (<Item label='password'>
                    {
                        getFieldDecorator('password', {
                            rules:[
                                {required: true, message: 'please input username'}
                            ]
                        })(<Input placeholder='please input password' />)
                    }
                </Item>)
                }
                
                <Item label='phone'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            rules:[]
                        })(<Input placeholder='please input phone number' />)
                    }
                </Item>
                <Item label='email'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                            rules:[]
                        })(<Input placeholder='please input email' />)
                    }
                </Item>
                <Item label='role'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules:[]
                        })(<Select placeholder='please select a role'>
                            {
                                roles.map(role => (
                                    <Option key = {role._id} value={role._id}>{role.name}</Option>
                                ))
                            }
                        </Select>)
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm);
import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
class AddForm extends Component{
    static propTypes = {
        setForm: PropTypes.func.isRequired,  //把内部form对象传给外部
    }

    componentWillMount(){
        this.props.setForm(this.props.form);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },      //指定右侧包裹的宽度
        };
        return (
            <Form {...formItemLayout}>
                <Item label="角色名称">
                    {getFieldDecorator('roleName', {
                        rules: [{required: true, message: 'Please input a new role'}]
                    })(
                        <Input placeholder="请输入角色名称"></Input>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm);
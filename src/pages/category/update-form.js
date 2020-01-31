import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Form, Input } from 'antd';

const Item = Form.Item;
/**
 * 更新分类的form组件
 */
class UpdateForm extends Component{
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    //同步调用
    componentWillMount(){
        //将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { categoryName } = this.props;
        return (
            <Form>
                <Item>
                    {getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [
                            {required: true, message: 'must input'}
                        ]
                    })(
                        <Input placeholder="请输入分类名称"></Input>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)
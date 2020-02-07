import React, { Component } from 'react';
import { Form, Input, Tree } from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/manuConfig';

const Item = Form.Item;
const { TreeNode } = Tree;

export default class AuthForm extends Component{
    static propTypes = {
        role: PropTypes.object
    }

    //根据传入角色的menu生成初始状态
    constructor(props){
        super(props);
        const { menus } = this.props.role;
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(<TreeNode title={item.title} key={item.key}>
                {item.children ? this.getTreeNodes(item.children) : null}
            </TreeNode> )
            return pre;
        },[])
    }

    onCheck = checkedKeys => {
        this.setState({checkedKeys});
    };

    //父组件读取最新menus方法
    getMenus = () => this.state.checkedKeys;

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList);
    }
    //当组件接收到新的属性调用，在render前
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus;
        this.setState({
            checkedKeys: menus
        })
    }
    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },      //指定右侧包裹的宽度
        };
        const {role} = this.props;
        const { checkedKeys } = this.state;
        return (
            <Form {...formItemLayout}>
                <Item label="角色名称">
                    <Input value={role.name} disabled></Input>
                </Item>
                <Tree checkable defaultExpandAll 
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}>
                    <TreeNode title="平台权限">
                    { this.treeNodes }
                    </TreeNode>
                    
                </Tree>
            </Form>
        )
    }
}
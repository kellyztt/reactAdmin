import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from '../../utils/memoryUtils';
import storageutils from '../../utils/storageUtils';
import { formateDate } from '../../utils/dateUtils';

export default class Role extends Component{
    constructor(props){
        super(props);
        this.auth = React.createRef();

    }
    state = {
        roles: [
            {
                "menus":[
                    "/home",
                    "/products",
                    "/category",
                    "/role"
                ],
                "_id": "111",
                "name": "角色1",
                "create_time": 1554639552758,
                "auth_time": 1557630307021,
                "auth_name": "admin"
            },
            {
                "menus":[
                    "/home",
                    "/products",
                    "/category",
                    "/role"
                ],
                "_id": "222",
                "name": "角色2",
                "create_time": 1554639552758,
                "auth_time": 1557630307021,
                "auth_name": "admin"
            },
            {
                "menus":[
                    "/home",
                    "/products",
                    "/category",
                    "/role"
                ],
                "_id": "333",
                "name": "角色3",
                "create_time": 1554639552758,
                "auth_time": 1557630307021,
                "auth_name": "admin"
            }
        ],  //所有角色列表
        role: {}, //当前选中的
        isShowAdd: false,
        isShowAuth: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
              },
              {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
              },
              {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
              },
              {
                title: '授权人',
                dataIndex: 'auth_name',
              },
        ];
    }
    
    getRoles = async () => {
        const results = await reqRoles();
        if (results.status === 0){
            const roles = results.data;
            this.setState(roles);
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role});
            }, // 点击行
            
          };
    }

    addRole = () => {
        //表单验证，通过了才继续
        this.form.validateFields(async(err, values) => {
            if (!err){
                const { roleName }  = values;
                this.form.resetFields();
                const result = await reqAddRole(roleName);
                if (result.status === 0){
                    const role = result.data;
                    //把新role加进roles[]
                    //更新roles状态：基于原本状态数据，在原有数组里添加一个
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('failed');
                }
            }
        })
        
        this.setState({isShowAdd: false});
    }

    updateRole = async () => {
        this.setState({isShowAuth:false});
        const { role } = this.state;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        role.auth_time = Date.now();
        role.auth_name = memoryUtils.user.username;
        const result = await reqUpdateRole(role);
        if (result.status === 0){
            message.success('更新角色权限成功');
            //如果当前更新的是自己角色的权限，则需要重新登录
            if (role._id === memoryUtils.user.role_id){
                //清除当前用户信息
                memoryUtils.user = {};
                storageutils.removeUser();
                this.props.history.replace('/login');
                message.success('角色权限有变化，请重新登录');
            } else {
                message.success('设置角色权限成功');
                this.setState({
                    roles: [...this.state.roles]
                });
            }
        }
    }

    handleCancel = () => {
        //清除输入数据
        //this.form.resetFields();
        //隐藏
        this.setState({isShowAdd: false});
    }

    componentWillMount(){
        this.initColumns();
    }

    componentDidMount() {
        this.getRoles();
    }

    render(){
        const { roles, role, isShowAdd, isShowAuth } = this.state;
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table 
                bordered 
                rowKey='_id' 
                columns={this.columns} 
                dataSource={roles} 
                pagination={{defaultPageSize: PAGE_SIZE}} 
                rowSelection={{type: 'radio',selectedRowKeys:[role._id]}}
                onRow={this.onRow}/>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                <AddForm 
                    //把接收到的form存起来
                    setForm={(form) => {this.form = form}}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                <AuthForm role={role} ref={this.auth}/>
                </Modal>

            </Card>
        )
    }
}
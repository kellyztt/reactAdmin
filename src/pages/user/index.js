import React, { Component } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/link-button';
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api';
import UserForm from './user-form';

export default class User extends Component{
    state = {
        loading: false,
        users: [], //所有用户
        roles: [],
        isVisible: false,
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (  //接收某一行数据
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
                
            }
        ]
    }

    //定义一个role_id和role name的映射关系
    initUserNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        },{});
        this.roleNames = roleNames;
    }

    addOrUpdateUser = async () => {
        const user = this.form.getFieldsValue();
        this.form.resetFields();
        //如果是更新，需要给user指定_id
        if (this.user){
            user._id = this.user._id;

        }
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0){
            message.success(this.user ? '修改' : '添加' + '用户成功');
            this.getUsers();
        }
        this.setState({isVisible: false});
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `Do you really want to delete ${user.username}`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0){
                    message.success('删除成功');
                    this.getUsers();
                }
            }

        })
    }

    handleCancel = () => {
        this.form.resetFields();
        this.setState({isVisible: false})
    }

    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0){
            const { users, roles } = result.data;
            this.initUserNames(roles);
            this.setState({
                users,
                roles
            })
        }
    }

    /**显示添加界面 */
    showAdd = () => {
        this.user = null; //去除之前保存的user
        this.setState({
            isVisible: true
        })
    }
    /**显示修改界面 */
    showUpdate = (user) => {
        this.user = user;    //保存user，用于显示在界面
        this.setState({
            isVisible: true
        })
    }

    componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){
        this.getUsers();
    }
    render(){
        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )
        const { loading, users, isVisible, roles } = this.state;
        const user = this.user || {};
        return (
            <Card title={title}>
                <Table
                bordered
                rowKey='_id'
                loading={loading}
                dataSource={users}
                columns={this.columns} />
                <Modal
                title={user._id ? '修改用户' : "添加用户"}
                visible={isVisible}
                onOK={this.addOrUpdateUser}
                onCancel={this.handleCancel}
                >
                    <UserForm setForm={form => this.form = form} roles={roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}
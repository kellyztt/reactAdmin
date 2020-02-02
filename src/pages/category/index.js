import React, { Component } from 'react';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api';
import { Card, Table, Button, Icon, message, Modal } from 'antd';
import AddForm from './add-form';
import UpdateForm from './update-form';
/**
 * 商品分类路由
 */
export default class Category extends Component{
    state = {
        loading: false,
        categorys: [],   //一级分类列表
        subCategorys: [],  //二级分类列表
        parentID: '0',    //父分类id
        parentName: '',     //父分类名称
        showStatus: 0 //表示添加、更新的确认框是否显示，0表示都不显示，1表示添加，2表示更新
    }
    /**
     * 初始化table列数据
     */
    initColumns = () => {
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width: 300,
              key: 'action',
              render: (category) => (
                  //不能直接写两个标签，要在外面包一个根标签
                  <span>
                      <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                      {/* 这样写函数在render的时候调用, 自执行函数
                    <LinkButton onClick={this.showSubCategorys}>查看子分类</LinkButton> */}
                    {/**如何向事件回调函数传递参数：先定义一个匿名函数，再调用处理函数并传入数据 */}
                    {this.state.parentID === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)} >查看子分类</LinkButton> : null}
                    
                  </span>
              )
            },
        ];
    }

    /**如果没有指定parentid则根据指定状态中的发请求，否则根据指定的parentid发请求 */
    getCategorys = async (parentId) => {
        //在发请求前显示loading
        this.setState({loading: true});
        parentId = parentId || this.state.parentID;
        const result  = await reqCategorys(parentId);
        //在请求完成后,隐藏loading

        this.setState({loading: false});
        if (result.status === 0){
            const categorys = result.data;
            //更新一级分类状态
            if (parentId === '0'){
                this.setState({categorys})
            } else {
                this.setState({subCategorys: categorys});
            }
           
        } else {
            message.error('获取分类列表失败');
        }
    }

    showCategorys = () => {
        //setState()是异步更新状态，所以不能立刻获取最新的状态
        this.setState({
            parentID: '0',
            parentName: '',
            subCategorys: []
        });   
    }

    //获取二级列表
    showSubCategorys = (category) => {
        //setState()是异步更新状态，所以不能立刻获取最新的状态
        this.setState({
            parentID: category._id, 
            parentName: category.name
        }, () => {   //在状态更新且重新render()后执行)
            //获取二级分类列表
            this.getCategorys();
        });
        
    }

    addCategory = () => {
        //收集数据并提交添加分类请求
        this.form.validateFields(async (err, values) => {
            if (!err){
                const { parentId, categoryName } = values
                this.form.resetFields();
                const result = await reqAddCategory(parentId, categoryName)
                if (result.status === 0){
                    //重新获取列表显示
                    if (parentId === this.state.parentID){
                        //只有添加的是当前分类时，才需要重新获取
                        this.getCategorys();
                    } else if (parentId === '0'){
                        //在二级列表下添加一级category，需要重新获取一级列表，单不需要显示
                        this.getCategorys('0');
                    }
                }
                this.setState({
                    showStatus: 0
                });
            }
        })   
    }

    updateCategory = () => {
        //进行表单验证，通过了才能处理
        this.form.validateFields(async (err, values) => {
            if (!err){
                //1. 发请求
                //准备数据
                const categoryId = this.category._id;
                const { categoryName } = values;
                //清除输入数据
                this.form.resetFields();
                //函数属性是子组件传给父组件
                const result = await reqUpdateCategory({categoryId, categoryName});
                if (result.status === 0){
                    //2. 重新显示表格
                    this.getCategorys();    
                } 
                //3. 关闭
                this.setState({
                    showStatus: 0
                })
            }
        }) 
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
        //保存分类对象
        this.category = category;
        this.setState({
            showStatus: 2
        })
    }

    //隐藏modal
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields();
        //隐藏
        this.setState({showStatus: 0});
    }
    //为第一次render准备数据
    componentWillMount(){
        this.initColumns();
    }
    
    //发异步ajax请求
    componentDidMount(){
        //this.getCategorys();

    }
    render(){
        const { categorys, subCategorys, parentID, parentName, loading, showStatus } = this.state;
        //读取指定的分类
        const category = this.category || {};
        //标题
        const title= (parentID === '0') ? "一级分类列表" : (
        <span>
            <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
            <Icon type="arrow-right" style={{marginRight: 5}}/>
            <span>{parentName}</span>
             
        </span>);
        //card右侧额外
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type="plus" />
                添加
            </Button>
        );
        //一级分类数据
        const data = [
            {
                parentID: '0',
                _id: "111",
                name: "家用电器",
                _v: 0
            },
            {
                parentID: '0',
                _id: '222',
                name: '电脑',
                _v: 0
            },
            {
                parentID: '0',
                _id: '333',
                name: '图书',
                _v: 0
            },
        ]
          
        return (
            <Card title={title} extra={extra}>
                <Table columns={this.columns} dataSource={data} bordered rowKey='_id' pagination={{defaultPageSize: 2}} loading={loading}/>
                {/* <Table columns={columns} dataSource={parentID === '0' ? categorys : subCategorys} bordered rowKey='_id' /> */}
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                <AddForm 
                categorys={categorys} 
                parentId={parentID} 
                setForm={(form) => {this.form = form}}/>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    >
                    <UpdateForm 
                    categoryName={category.name}
                    setForm={(form) => {this.form = form}}/>
                </Modal>
            </Card>
        )
    }
}
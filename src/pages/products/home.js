import React, { Component } from 'react';
import { Card, Table, Button, Select, Input, Icon, message } from 'antd';
import LinkButton from '../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
const Option = Select.Option;
/**product默认子路由组件 */
export default class ProductHome extends Component{
    state = {
        loading: false,
        products: [
            {
                '_id':'111',
                'name': '苹果macbook pro',
                'desc': '15.6英寸笔记本电脑',
                'price': 13999,
            },
            {
                '_id': '222',
                'name': '苹果macbook air',
                'desc': '超薄超轻',
                'price': 10999
            },
            {
                '_id': '333',
                'name': 'alienaremacbook air',
                'desc': '游戏本',
                'price': 20999
            }
        ],     //商品数组
        total: 0,
        searchType: 'productName', //默认按商品名称搜索 or productDesc
        searchName: ''
    }

    //初始化table的列数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '$' + price      //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                //dataIndex: 'status',    //0表示下架，1表示在售
                render: (product) => {
                    const { status, _id } = product;
                    return (
                    <span>
                        <Button 
                            type="primary" 
                            onClick={() => {this.updateStatus(_id, status === 1 ? 2 : 1)}}
                        >
                            {status === 1? '下架': '上架'}
                        </Button>
                        <span>{status === 1? '在售' : '已下架'}</span>            {/**当前在售，点击下架 */}
                    </span>)
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/products/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/products/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;   //保存pageNum, 让其他都能看见；
        this.setState({
            loading: true      //显示loading
        })
        const {searchType, searchName} = this.state;
        //如果搜索关键字有值， 搜索分页
        let result;
        if (searchName){
            //对象中属性没有先后顺序，靠属性名区分
            result = await reqSearchProducts({pageNum,PAGE_SIZE,searchName,searchType});
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({
            loading: false      //隐藏loading
        })
        if (result.state === 0){
            const { list, total } = result.data;
            this.setState({
                total,
                products: list
            });
        }
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0){
            message.success('更新成功');
            this.getProducts(this.pageNum);
        }
    }
    componentWillMount() {
        this.initColumns();
    }

    componentDidMount(){
        this.getProducts(1);
    }
    render(){
        const { products, total, loading, searchType, searchName } = this.state;
          
        const title = (
           //value是选定的值 
            <span>
                <Select 
                 value={searchType} 
                 style={{width: 150}}
                 onChange={value => this.setState({searchType:value})}>   
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                placeholder='请输入关键字' 
                style={{width: 200, margin: '0 15px'}} 
                value={searchName}
                onChange={e => this.setState({searchName: e.target.value})}/>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>        
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/products/addupdate')}><Icon type='plus' />添加商品</Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table 
                    dataSource={products} 
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    // loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper:true, 
                        total,
                        onChange: this.getProducts
                    }}

                    total>
                    
                </Table>
            </Card>
        )
    }
}
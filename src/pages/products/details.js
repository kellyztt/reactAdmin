import React, { Component } from 'react';
import { Card, Icon, List} from 'antd';
import { reqCategory, reqCategorys } from '../../api';
import LinkButton from '../../components/link-button';

const Item = List.Item;
/**product默认子路由组件 */
export default class ProductDetails extends Component{
    state = {
        pName: '',       //一级分类名称
        cName: ''        //二级分类名称
    }

    async componentDidMount(){
        const { pCategoryId, categoryId } = this.props.location.state.product;
        
        if (pCategoryId === '0'){
            const result = await reqCategory(categoryId);
            const pName = result.data.name;
            this.setState({pName});
        } else {
            /**通过多个await方式发送多个请求，后一个请求是在前一个请求成功返回之后才发送，效率低下
            const result1 = await reqCategory(pCategoryId);
            const pName = result1.data.name;
            const result2 = await reqCategory(categoryId);
            const cName = result2.data.name;
            this.setState({
                pName,
                cName
            }) */
            //一次性发送多个请求，只有都成功了，才正常处理,效率较高
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const pName = results[0].data.name;
            const cName = results[1].data.name;
        }
    }
    render(){
        //读取携带过来的state数据
        const { name, desc, price, detail } = this.props.location.state.product;
        const { pName, cName } = this.state;
        const title = (
            <span>
                <LinkButton>
                    <Icon 
                        type='arrow-left' 
                        style={{marginRight: 10, fontSize: 20}}
                        onClick={() => this.props.history.goBack()} /></LinkButton>
                
                <span>商品详情</span>
            </span>
        );
        const data = [
            '商品名称'
        ];
        const renderItem = (item) => (
            <Item>
                item
            </Item>
        )
        return (
            <Card title={title} className='product-detail'>
                <List bordered>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{'$' + price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{pName} {cName ? '-->' + cName : ''}</span>
                    </Item>
                    {/* <Item>
                        <span className='left'>商品图片:</span>
                        {
                            imgs.map(img => {
                                <img 
                                key={img}
                                className='product-img'
                                src={img}
                                alt="img"
                                />
                            })
                        }
                    </Item> */}
                    {/* <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item> */}
                </List>
            </Card>
        )
    }
}
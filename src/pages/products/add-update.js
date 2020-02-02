import React, { Component } from 'react';
import { Card, Form, Icon, Input, Cascader, Upload, Button } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './richTextEditor';

const Item = Form.Item;
const { TextArea } = Input;
const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
      },
]

/**product添加或更新子路由组件 */
class ProductAddUpdate extends Component{
    state = {
        options
        //options: []
    }

    constructor (props){
        super(props)
        //创建保存refs标识的标签对象的容器
        this.pw = React.createRef();
        this.editor = React.createRef();
    }

    submit = () => {
        //进行表单验证，通过了才发送请求
        this.props.form.validateFields(async (err, values) => {
            //1. 收集数据,并封装为product对象
            const {name, desc, price, categoryIds } = values;
            let pCategoryId, categoryId;
            if (categoryIds.length === 1){
                pCategoryId = '0';
                categoryId = categoryIds[0];
            } else {
                pCategoryId = categoryIds[0];
                categoryId = categoryIds[1];
            }
            const imgs = this.pw.current.getImageNames();
            const detail = this.editor.current.getDetail();
            const product = {name, desc, price, imgs, detail}
            //2. 调用接口请求函数去添加/更新
            //如果是更新，需要添加_id
            if(this.isUpdate){
                product._id = this.product._id;
                
            }
            const result = await reqAddOrUpdateProduct(product)
            //3. 更新提示
            if (!err){
                console.log('发送ajax请求');
                
            }
        })
    }

    // 验证价格的自定义验证函数,value是数字格式字符串
    validatePrice = (rule, value, callback) => {
        console.log(typeof value);
        if(value * 1 > 0){
            callback();
        } else {
            callback('价格必须大于0')
        }

    }

    onChange = (value, selectedOptions) => {

    }

    /**
     * 获取一级/二级分类列表，并展示
     * async函数的返回值是一个promise对象，promise的结果和值由async的结果决定
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId);
        if (result.status === 0){
            const categorys = result.data;
            if (parentId === '0'){
                this.initOptions();
            } else {
                return categorys; //返回二级列表=>当前async函数返回的promise就成功，且value为categorys
            }
        }

    }

    initOptions = async (categorys) => {
        //根据categorys数组生成options数组并更新状态
        //返回一个对象，不能丢掉小括号
        const options = categorys.map(c => ({
            label: c.name,
            value: c._id,
            isLeaf: false   //假设不是叶子
        }));
        //如果要更新一个二级分类商品
        const { isUpdate, product } = this;;
        const { pCategoryId, categoryId } = product;
        if (isUpdate && pCategoryId !== '0'){
            const subCategorys = await this.getCategorys(pCategoryId);
            //生成二级下拉列表options
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isleaf: true  
            }));
            //关联到一级option
            const targetOption = options.find(option => option.value === pCategoryId);
            targetOption.children = childOptions;
        }
        this.setState({options});
    }

    loadData = async selectedOptions => {
        //允许选择多个，得到option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
    
        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        targetOption.loading = false;
        if(subCategorys && subCategorys.length > 0){
            const childOptions = subCategorys.map(c=>({
              value: c._id,
              label: c.name,
              isleaf: true  
            }));
            targetOption.children = childOptions;
        } else { //当前选中的分类没有二级分类
            targetOption.isLeaf = true;
        }
        //更新options状态，里面某个option变了，重新解构
        this.setState({
            options: [...this.state.options],
        });
        
        // 模拟请求异步获取二级列表数据更新
        setTimeout(() => {
          targetOption.loading = false;
          targetOption.children = [
            {
              label: `${targetOption.label} Dynamic 1`,
              value: 'dynamic1',
            },
            {
              label: `${targetOption.label} Dynamic 2`,
              value: 'dynamic2',
            },
          ];
          //更新options状态，里面某个option变了，重新解构
          this.setState({
            options: [...this.state.options],
          });
        }, 1000);
      };

    componentWillMount(){
        //取出携带的state
        const product = this.props.location.state;
        //!!强制转成boolean，保存为是否更新的标识
        //如果是添加，则没有state，否则优有值
        this.isUpdate = !!product;
        //保存商品，如果没有则保存为{}
        this.product = product || {};
    }
    componentDidMount(){
        this.getCategorys('0');
    }

    render(){
        const { isUpdate, product } = this;
        const { pCategoryId, categoryId, imgs, detail } = product;
        const { getFieldDecorator } = this.props.form;
        const categoryIds = [];
        if (isUpdate){
            //商品是一个一级商品
            if (pCategoryId === '0'){
                categoryIds.push(categoryId);
            } else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
            //商品是一个二级商品
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        );

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 10 },      //指定右侧包裹的宽度
        };

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [{required: true, message: 'please input a product name'}]
                            })(
                                <Input placeholder='商品名称' />
                            )}
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [{required: true, message: 'please input a product description'}]})(
                                <TextArea placeholder='商品描述' autosize={{minRows:2, maxRows:6}}/>
                            )
                        } 
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: 'please input a product description'},
                                    {validator: this.validatePrice}
                                ],
                            })(
                                <Input type='number' addonAfter="元" />
                            )
                        }
                    </Item>
                    <Item label='商品分类'>
                    {
                        getFieldDecorator('categoryIds', {
                            rules: [{required: true, message: 'please input a product category'}]
                        })(
                            <Cascader 
                            options={this.state.options} /**需要显示的列表数据数组 */
                            loadData={this.loadData}    /**当选择某个列表项，加载下一级列表的监听回调 */
                            />
                        )} 
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>

        )
    }
}
export default Form.create()(ProductAddUpdate);
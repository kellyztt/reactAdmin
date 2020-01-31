import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetails from './details';
import './products.less';

export default class Products extends Component{
    render(){
        return (
            <Switch>
                <Route path='/products' component={ProductHome} exact/> {/**路径完全匹配，否则是逐层匹配 */}
                <Route path='/products/addupdate' component={ProductAddUpdate} />
                <Route path='/products/detail' component={ProductDetails} />
                <Redirect to='/products' />

            </Switch>
        )
    }
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

memoryUtils.user = storageUtils.getUser();
//读取Local中保存的user，保存到内存中
ReactDOM.render(<App />, document.getElementById('root'));


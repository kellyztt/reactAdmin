import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BASE_IMG_URL } from '../../utils/constants'
/**
 * 用于图片上传的组件
 */
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    constructor (props){
        super(props);
        const fileList = []
        const {imgs} = this.props;
        //判断是否有imgs传入
        if (imgs && imgs.length > 0){
            fileList = imgs.map((img,index) => ({
                uid: -index,
                name: img,
                status: 'done', //传过来了肯定是上传过了的
                url: BASE_IMG_URL + img
            }));
        }
        this.state = {
            previewVisible: false,   //是否显示大图预览Modal
            previewImage: '',     //大图的URL
            fileList: fileList  //所有已上传图片的数组
        }
    }

  state = {
    previewVisible: false,   //是否显示大图预览Modal
    previewImage: '',     //大图的URL
    fileList: [
      {
        uid: '-1',   //文件唯一标识
        name: 'image.png',  //图片文件名
        status: 'done',  //图片状态，done:图片已上传，uploading:正在上传中，removed: 已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    fileList: [
      {
        uid: '-1',   //文件唯一标识
        name: 'image.png',  //图片文件名
        status: 'done',  //图片状态，done:图片已上传，uploading:正在上传中，removed: 已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };

  /**隐藏Modal */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /**
   * file: 当前操作的图片文件（上传/删除）
   * file.response是响应
   * 在操作（上传/删除）过程中更新fileList对象
   */
  handleChange = async ({ file, fileList }) => {
    //一旦上传成功，将当前上传的file的信息修正(name，url)
    if(file.status === 'done'){
        //{status: 0, data: {name: 'xxx.jpg', url: '...'}}
        const result = file.response;
        if (result.status === 0){
            const { name, url } = result.data;
            file = fileList[fileList.length - 1];
            file.name = name;
            file.url = url;
        }
    } else if (file.status === 'removed'){
        //界面上删除成功
        const result = await reqDeleteImg(file.name);
        if (result.status === 0){
            message.success('删除图片成功');
        }
    }

    this.setState({fileList})
  }

  getImageNames = () => {
    return this.state.fileList.map(file => file.name);
}

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"   /**上传的接口地址 */
          accept='image/*'      /**只接受图片格式 */
          listType="picture-card"
          fileList={fileList}  /**所有已上传的文件列表 */
          name='image' /**请求参数名，参数值就是文件 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
       {/* footer是下面的两个按钮，cancel和OK */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}



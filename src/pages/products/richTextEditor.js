/**
 * 富文本编辑器
 * react-draft-wysiwyg 
 */
import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default class RichTextEditor extends Component {
    //父组件传了属性
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props){
        super(props);
        const html = this.props.detail;
        if (html){
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), //创建一个空白编辑器
            }
        }
    }
    
  /**
   * 输入过程中实时回调
   */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  
  //获得标签格式的文本
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  uploadCallback = (file) => {
      return new Promise(
          (resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/manage/img/upload');
              const data = new FormData();
              data.append('image', file);
              xhr.send(data);
              xhr.addEventListener('load', () => {
                  const response = JSON.parse(xhr.responseText);
                  const { url } = response.data;
                  resolve({data:{link:url}});
              });
              xhr.addEventListener('error', () => {
                  const error = JSON.parse(xhr.responseText)
                  reject(error)
              })
          }
      )
  }

  render() {
    const { editorState } = this.state;
    return (
        <Editor
          editorState={editorState}
          editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{image: {uploadCallback: this.uploadCallback, alt: { present: true, mandatory: true}}}}
        /> 
    );
  }
}
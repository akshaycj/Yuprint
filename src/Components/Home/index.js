import React, { Component } from "react";
import { Upload, Icon,Button ,message,Select,List,Spin} from "antd";
import { Consumer } from "../../Context/DataContext";
import "./index.css";

export default props => (
  <Consumer>{({ user }) => <Home {...props} user={user} />}</Consumer>
);

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      isUploading:false
    };
  }
  componentDidMount() {
    console.log("props", this.props.user);
  }

  onChange=(info)=> {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      info.fileList.map((item)=>{
        if (info.file.uid===item.uid) {
          item.paperSize='A4'
        }
      })
      this.setState({fileList:info.fileList,isUploading:false})
      console.log('state',this.state.fileList);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.setState({isUploading:false})
    }
  }

  handleDelete=(index)=>{
    let fileList = this.state.fileList
    fileList.splice(index,1)
    this.setState({fileList})
  }
  handleChange=(value,item)=>{
    item.paperSize=value
    console.log(this.state.fileList);
  }
  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList:false,
      multiple:true
    };
    const { fileList } = this.state;
    const Option = Select.Option;
    return (
      <div className="home-main">
        <Upload  {...props} onChange={this.onChange} beforeUpload={()=>this.setState({isUploading:true})}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        {this.state.isUploading ?<Spin /> :null }
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={fileList}
          renderItem={(item,index) => (
            <List.Item className="list-item">
              <h4 style={{flex:2}}>{item.name}</h4>
              <Select defaultValue="A4" style={{flex:1, width: 50,fontSize:12 }} onChange={(e)=>this.handleChange(e,item)}>
                <Option value="A4">A4</Option>
                <Option value="A3">A3</Option>
                <Option value="A2">A2</Option>
              </Select>
              <Button style={{flex:1}} type='danger' onClick={()=>this.handleDelete(index)}>
                <Icon type="delete" />
              </Button>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

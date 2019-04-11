import React, { Component } from "react";
import { Upload,Icon,Input,Button,message,Select,List,Spin,Tabs} from "antd";
import { Consumer } from "../../../Context/DataContext";
import { storage,db } from "./../../../Utils/config";
import "./index.css";

export default props => (
  <Consumer>{({ user }) => <ContentCreator {...props} user={user} />}</Consumer>
);

 class ContentCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],description:'',
      loading:false,urls:[]
    };
  }
  componentDidMount() {
    console.log("props", this.props.user);
  }

  handleUpload=()=>{
    this.setState({loading:true})
    console.log('fileList',this.state.fileList);
    setTimeout(()=>{
      message.success('upload success')
      this.setState({loading:false})
    },1500)

  }
  handleDelete=(index)=>{
    let fileList = this.state.fileList
    fileList.splice(index,1)
    this.setState({fileList})
  }
  handleSizeChange=(value,item)=>{
    item.paperSize=value
  }
  beforeUpload=(file)=>{
    let allowedExtensions=['pdf', 'doc', 'docx', 'xls', 'xlsx']
    let allowedMIMEType = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (allowedMIMEType.indexOf(file.type) === -1) {
    message.error(`You can only upload  ${allowedExtensions.join(', ')}  file!`);
    return false;
    }
    file.paperSize='A4'
    this.setState(state => ({
      fileList: [...state.fileList, file],
    }));
    return false;
  }
  handleDescriptionChange=(e)=>{
    this.setState({description:e.target.value})
  }
  render() {
    const { fileList , isFile , loading} = this.state;
    const Option = Select.Option;
    const {TextArea}=Input
    return (
      <div className="home-main">
        <Upload  showUploadList={false} multiple={true} beforeUpload={this.beforeUpload}>
          <Button>
            <Icon type="upload" />  click to select items
          </Button>
        </Upload>
        <div className="list-container">
          <List
            className="list"
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={(item,index) => (
              <List.Item className="list-item">
                <h4 style={{flex:2}}>{item.name}</h4>
                <Select defaultValue="A4" style={{flex:1, width: 50,fontSize:12 }} onChange={(e)=>this.handleSizeChange(e,item)}>
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
        {/* <TextArea rows={4}  style={{marginBottom:20}}
          placeholder='description ...' value={this.state.description}
          onChange={this.handleDescriptionChange}/> */}
        <Button type="primary" onClick={this.handleUpload} disabled={fileList.length ? false:true}>
          Upload
        </Button>
        {loading ? <Spin /> : null}
      </div>
    );
  }
}

import React, { Component } from "react";
import { Upload,Icon,Input,Button,message,Select,List,Spin} from "antd";
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
      loading:false
    };
    this.data={
      desc:this.state.description,
      user:this.props.user.id,

    }
  }
  componentDidMount() {
    console.log("props", this.props.user);
  }

  handleUpload=()=>{
    this.setState({loading:true})
    setTimeout(()=>{
      console.log(this.state.fileList);
      this.setState({loading:false,fileList:[]})
      message.success('upload successful.');
    },2000)
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
    // if (file.type != "image/jpeg") {
    // message.error('You can only upload JPG file!');
    // return false;
    // }
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
            <Icon type="upload" /> Click to Select Items
          </Button>
        </Upload>
        <List
          className="demo-loadmore-list"
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
        <TextArea rows={4}  style={{marginBottom:20}}
          placeholder='description ...' value={this.state.description}
          onChange={this.handleDescriptionChange}/>
        <Button type="primary" onClick={this.handleUpload} disabled={fileList.length ? false:true}>
          Upload
        </Button>
        {loading ? <Spin /> : null}
      </div>
    );
  }
}

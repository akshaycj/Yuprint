import React, { Component } from "react";
import { Upload,Icon,Input,Button,message,Select,List,Spin,Tabs} from "antd";
import { Consumer } from "../../../Context/DataContext";
import { storage,db } from "./../../../Utils/config";
import "./index.css";

export default props => (
  <Consumer>{({ user }) => <UploadHome {...props} user={user} />}</Consumer>
);

 class UploadHome extends Component {
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
    let id=this.props.user.id||'test user id'
    let urls=this.state.urls
    let storeFileStorage=this.state.fileList.map((item,index)=>{
      let uploadFile=storage.ref('files').child('users').child(id).child(item.name).put(item)
      uploadFile.on('state_changed',
      function(snapshot){ console.log('snapshot',snapshot);},
      function(error) {console.error("Something nasty happened", error);},
      ()=> {
        let location = uploadFile.snapshot.ref.location.bucket ;
        var path = uploadFile.snapshot.ref.location.path ;
        let downloadURL=location+'/'+path
        let urls=this.state.urls
        urls[index]={
          urls:downloadURL,
          type:item.paperSize
        }
        this.setState({urls})
      });
      return uploadFile;
    })
    Promise.all(storeFileStorage).then(()=> {
      let data={
        description:this.state.description,
        user:this.props.user.uid||'test user',
        mobile:this.props.user.phoneNumber||'test mobileNo',
        timestamp:new Date().toISOString(),
        urls:this.state.urls,
        status:'active'
      }
      console.log('data',data);
      db.ref('store').child('orders').child('active').set({data},(err)=>{
        this.setState({loading:false,fileList:[]})
        if (err) {
          message.error('upload failed.')
        }
        else {
          message.success('upload successful')
        }
      })
    })
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
    console.log(file.type);
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

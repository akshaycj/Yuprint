import React, { Component } from "react";
import { Upload,Icon,Input,Button,message,Select,List,Spin,Tabs} from "antd";
import { Consumer } from "../../Context/DataContext";
import { storage,db } from "./../../Utils/config";
import "./index.css";
import UploadHome from './Upload'
import ContentCreator from './ContentCreator'

export default class Home extends Component {
  constructor(props) {
    super()
  }
  render() {
    const TabPane = Tabs.TabPane
    return (
      <Tabs defaultActiveKey="1" >
        <TabPane tab="Tab 1" key="1"><UploadHome /></TabPane>
        <TabPane tab="Tab 2" key="2"><ContentCreator /></TabPane>
      </Tabs>
    );
  }
}

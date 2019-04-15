import React, { Component } from "react";
import { Tabs, Input, Icon } from "antd";
import "./index.css";
import UploadHome from "./Upload";
import ContentCreator from "./ContentCreator";
import logo from "../../Res/logo.svg";
import UploadButton from "./UploadButton/index";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "print"
    };
  }
  componentDidMount = () => {
    this.setElementStyle("print");
  };
  onTabItemClick = e => {
    var active = e.target.id;
    this.setState({ active });
    this.setElementStyle(active);
  };
  setElementStyle = active => {
    var tabs = ["print", "content", "upload"];
    tabs.map(item => {
      var el = document.getElementById(item);
      if (item === active) {
        el.setAttribute("style", "font-weight:bold;color:white");
      } else {
        el.removeAttribute("style");
      }
    });
  };
  render() {
    const TabPane = Tabs.TabPane;
    const { active } = this.state;
    return (
      <div className="main-container">
        <div className="tab-header grad-back">
          <div className="logo-container">
            <img src={logo} />
          </div>
          <div className="navbar">
            <span id="print" onClick={this.onTabItemClick}>
              Print
            </span>
            <span id="content" onClick={this.onTabItemClick}>
              Content
            </span>
            <span id="upload" onClick={this.onTabItemClick}>
              Upload
            </span>
          </div>
        </div>
        <div className="search-container">
          <Input />
          <Icon type="search" />
        </div>
        <Tabs
          defaultActiveKey="print"
          activeKey={active}
          renderTabBar={() => <div />}
          className="container"
        >
          <TabPane tab="Tab 1" key="print">
            <UploadButton />
          </TabPane>
          <TabPane tab="Tab 2" key="content">
            <UploadHome />
          </TabPane>
          <TabPane tab="Tab 2" key="upload">
            <ContentCreator />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

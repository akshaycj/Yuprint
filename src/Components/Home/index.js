import React, { Component } from "react";
import { Tabs, Input, Icon } from "antd";
import "./index.css";
import UploadHome from "./Upload";
import ContentFeed from "./ContentFeed";
import logo from "../../Res/logo.svg";

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
      return true;
    });
  };
  render() {
    const TabPane = Tabs.TabPane;
    const { active } = this.state;
    return (
      <div className="main-container">
        <div className="tab-header grad-back">
          <div className="logo-container">
            <img src={logo} alt="logo" />
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
          <TabPane className="upload-home-tab" tab="Tab 1" key="print">
            <UploadHome type="print" />
          </TabPane>
          <TabPane className="content-tab" tab="Tab 2" key="content">
            <ContentFeed />
          </TabPane>
          <TabPane tab="Tab 2" key="upload">
            <UploadHome type="upload" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

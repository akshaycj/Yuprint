import React from "react";
import { Select, List, Icon } from "antd";

const Option = Select.Option;

export default ({
  type,
  fileList,
  handleColorChange,
  handleSizeChange,
  handleDelete
}) => (
  <div className="list-container">
    <List
      className="list"
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={(item, index) => (
        <List.Item className="list-item">
          <div className="top-content">
            <h4 style={{ flex: 2 }}>{item.name}</h4>
            <Icon
              type="delete"
              style={{ flex: 0.1, color: "red" }}
              onClick={() => handleDelete(index)}
            />
          </div>
          {type === "print" ? (
            <div className="dropDown-container">
              <Select
                defaultValue="Black and White"
                style={{ fontSize: 12 }}
                onChange={e => handleColorChange(e, item)}
              >
                <Option value="Color">Color</Option>
                <Option value="Black and White">Black and White</Option>
              </Select>
              <Select
                defaultValue="A4"
                style={{ fontSize: 12 }}
                onChange={e => handleSizeChange(e, item)}
              >
                <Option value="A4">A4</Option>
                <Option value="A3">A3</Option>
                <Option value="A2">A2</Option>
              </Select>
            </div>
          ) : null}
        </List.Item>
      )}
    />
  </div>
);

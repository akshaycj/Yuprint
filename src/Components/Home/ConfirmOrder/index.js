import React from "react";
import { List, Card } from "antd";

export default ({ fileList, confirmOrder }) => (
  <div className="confirmOrder-container">
    <List
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={(item, index) => (
        <List.Item className="list-item">
          <Card title={item.name} bordered={false} style={{ width: 300 }}>
            <p>{item.name}</p>
            <p>Pages: {item.pages}</p>
            <p>Cost per page: 1</p>
            <p>
              Total cost: {item.pages} x 1 = {item.pages * 1}
            </p>
          </Card>
        </List.Item>
      )}
    />
    <div className="upload-button-group">
      <div className="upload-button cancel-button">Cancel</div>{" "}
      <div
        onClick={confirmOrder}
        className="upload-button upload-button-border"
      >
        Confirm Order
      </div>
    </div>
  </div>
);

import React from "react";
import { List, Card, Modal } from "antd";

export default ({
  fileList,
  confirmOrder,
  showModal,
  hideModal,
  visible,
  cancelOrderConfirm
}) => (
  <div className="confirmOrder-container">
    <List
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={(item, index) => (
        <List.Item className="list-item">
          <Card title={item.name} bordered={false} style={{ width: 300 }}>
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
      <div className="upload-button cancel-button" onClick={showModal}>
        Cancel
      </div>{" "}
      <div
        onClick={confirmOrder}
        className="upload-button upload-button-border"
      >
        Confirm Order
      </div>
    </div>
    <Modal
      title="Cancel Order?"
      visible={visible}
      onOk={cancelOrderConfirm}
      onCancel={hideModal}
      okText="Yes"
      cancelText="No"
    >
      <p>Are you sure to cancel the order?</p>
    </Modal>
  </div>
);
